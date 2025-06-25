import request from "supertest";
import mongoose from "mongoose";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import app from "../server";
import Testimonial from "../models/Testimonial";
import Auth from "../models/Auth";

dotenv.config();

let token: string;
let testimonialId: string;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_TEST_URL!);

  // Create test user with "senior" role
  const hashedPassword = await bcrypt.hash("test1234", 10);
  const user = await Auth.create({
    name: "Senior Test User",
    email: "senior@test.com",
    password: hashedPassword,
    role: "senior",
  });

  // Generate JWT token
  token = jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN_SECRET!, {
    expiresIn: "1h",
  });
});

afterAll(async () => {
  await Testimonial.deleteMany();
  await Auth.deleteMany();
  await mongoose.connection.close();
});

describe("Testimonial API", () => {
  it("should create a testimonial", async () => {
    const res = await request(app)
      .post("/api/testimonials")
      .set("Cookie", [`accessToken=${token}`])
      .send({
        name: "John Doe",
        jobTitle: "Engineer",
        quote: "This is a great service.",
        imageUrl: "https://example.com/image.jpg",
      });

    expect(res.status).toBe(201);
    expect(res.body.testimonial.name).toBe("John Doe");
    testimonialId = res.body.testimonial._id;
  });

  it("should fetch all testimonials", async () => {
    const res = await request(app).get("/api/testimonials");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.testimonials)).toBe(true);
    expect(res.body.testimonials.length).toBeGreaterThan(0);
  });

  it("should update a testimonial", async () => {
    const res = await request(app)
      .put(`/api/testimonials/${testimonialId}`)
      .set("Cookie", [`accessToken=${token}`])
      .send({
        quote: "Updated testimonial quote.",
      });

    expect(res.status).toBe(200);
    expect(res.body.testimonial.quote).toBe("Updated testimonial quote.");
  });

  it("should return 404 when updating non-existing testimonial", async () => {
    const res = await request(app)
      .put("/api/testimonials/000000000000000000000000")
      .set("Cookie", [`accessToken=${token}`])
      .send({
        quote: "Does not exist",
      });

    expect(res.status).toBe(404);
    expect(res.body.message).toBe("Testimonial not found");
  });

  it("should delete a testimonial", async () => {
    const res = await request(app)
      .delete(`/api/testimonials/${testimonialId}`)
      .set("Cookie", [`accessToken=${token}`]);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Testimonial deleted successfully");
  });

  it("should return 404 when deleting non-existing testimonial", async () => {
    const res = await request(app)
      .delete(`/api/testimonials/${testimonialId}`)
      .set("Cookie", [`accessToken=${token}`]);

    expect(res.status).toBe(404);
    expect(res.body.message).toBe("Testimonial not found");
  });
});
