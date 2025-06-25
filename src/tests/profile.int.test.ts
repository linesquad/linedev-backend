import request from "supertest";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import app from "../server";
import Auth from "../models/Auth";

dotenv.config();

let token: string;
let userId: string;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_TEST_URL!);

  // Create a test user
  const hashedPassword = await bcrypt.hash("test1234", 10);
  const user = await Auth.create({
    name: "Test User",
    email: "test@example.com",
    password: hashedPassword,
    role: "junior",
  });

  userId = user._id.toString();

  // Generate JWT token
  token = jwt.sign({ id: userId }, process.env.ACCESS_TOKEN_SECRET!, {
    expiresIn: "1h",
  });
});

afterAll(async () => {
  await Auth.deleteMany({});
  await mongoose.disconnect();
});
describe("GET /api/profile", () => {
  it("should return 200 and user data when authorized", async () => {
    const res = await request(app)
      .get("/api/profile")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("user");
    expect(res.body.user).toMatchObject({
      id: userId,
      name: "Test User",
      email: "test@example.com",
      role: "user",
    });
  });

  it("should return 401 if no token is provided", async () => {
    const res = await request(app).get("/api/profile");
    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Unauthorized");
  });

  it("should return 401 for invalid token", async () => {
    const res = await request(app)
      .get("/api/profile")
      .set("Authorization", "Bearer invalidtoken");

    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Unauthorized");
  });
});
