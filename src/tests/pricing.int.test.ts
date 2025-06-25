import request from "supertest";
import mongoose from "mongoose";
import dotenv from "dotenv";
import app from "../server";
import Pricing from "../models/pricing";
import Auth from "../models/Auth";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

dotenv.config();

let token: string;
let userId: string;
let createdPricingId: string;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_TEST_URL!);

  // Create test user
  const password = await bcrypt.hash("test1234", 10);
  const user = await Auth.create({
    name: "Test Senior",
    email: "senior@example.com",
    password,
    role: "senior",
  });
  userId = user._id.toString();

  // Generate JWT token
  token = jwt.sign({ id: userId }, process.env.ACCESS_TOKEN_SECRET!, {
    expiresIn: "1h",
  });
});

afterAll(async () => {
  await Pricing.deleteMany();
  await Auth.deleteMany();
  await mongoose.connection.close();
});

describe("Pricing API", () => {
  it("should create a new pricing", async () => {
    const response = await request(app)
      .post("/api/pricing")
      .set("Cookie", [`accessToken=${token}`])
      .send({
        title: "Pro Plan",
        description: "For professionals",
        price: 99,
        features: ["Priority support", "Unlimited usage"],
      });

    expect(response.status).toBe(201);
    expect(response.body.pricing).toHaveProperty("_id");
    expect(response.body.pricing.title).toBe("Pro Plan");
    createdPricingId = response.body.pricing._id;
  });

  it("should fetch all pricing entries", async () => {
    const response = await request(app).get("/api/pricing");
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it("should update pricing by ID", async () => {
    const response = await request(app)
      .put(`/api/pricing/${createdPricingId}`)
      .set("Cookie", [`accessToken=${token}`])
      .send({
        title: "Pro Plan Updated",
        description: "Updated description",
        price: 119,
        features: ["New feature", "Extended support"],
      });

    expect(response.status).toBe(200);
    expect(response.body.updatedPricing.title).toBe("Pro Plan Updated");
  });

  it("should return 404 for non-existing pricing update", async () => {
    const response = await request(app)
      .put(`/api/pricing/000000000000000000000000`)
      .set("Cookie", [`accessToken=${token}`])
      .send({
        title: "Fake",
        description: "Fake",
        price: 1,
        features: ["None"],
      });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Pricing not found");
  });

  it("should delete pricing by ID", async () => {
    const response = await request(app)
      .delete(`/api/pricing/${createdPricingId}`)
      .set("Cookie", [`accessToken=${token}`]);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Pricing deleted successfully");
  });

  it("should return 404 for non-existing pricing delete", async () => {
    const response = await request(app)
      .delete(`/api/pricing/${createdPricingId}`)
      .set("Cookie", [`accessToken=${token}`]);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Pricing not found");
  });
});
