import request from "supertest";
import app from "../server";
import connectDB from "../config/db";
import mongoose from "mongoose";
import { createTestAccount } from "./utils/createTestAccount";

let seniorToken: string;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URL!);

  const seniorAccount = await createTestAccount("senior");
  seniorToken = seniorAccount.accessToken;
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

describe("Pricing", () => {
  let id: string;
  it("should create a pricing", async () => {
    const res = await request(app)
      .post("/api/pricing")
      .set("Cookie", `accessToken=${seniorToken}`)
      .send({
        title: "Test Pricing",
        description: "Test Description",
        price: 100,
        features: ["Feature 1", "Feature 2"],
      });
    expect(res.status).toBe(201);
    expect(res.body.message).toBe("Pricing created successfully");
    id = res.body.pricing._id;
  });

  it("should get all pricing", async () => {
    const res = await request(app)
      .get("/api/pricing")
      .set("Cookie", `accessToken=${seniorToken}`);
    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });
  it("should update a pricing", async () => {
    const res = await request(app)
      .put(`/api/pricing/${id}`)
      .set("Cookie", `accessToken=${seniorToken}`)
      .send({
        title: "Updated Pricing",
        description: "Updated Description",
        price: 200,
        features: ["Feature 1", "Feature 2"],
      });
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Pricing updated successfully");
  });
  it("should delete a pricing", async () => {
    const res = await request(app)
      .delete(`/api/pricing/${id}`)
      .set("Cookie", `accessToken=${seniorToken}`);
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Pricing deleted successfully");
  });
});
