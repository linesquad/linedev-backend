import request from "supertest";
import app from "../server";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URL!);
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
});

describe("Auth API", () => {

  it("should register a new account", async () => {
    const response = await request(app).post("/api/auth/register").send({
      name: "test",
      email: "test@test.com",
      password: "testpassword",
      role: "client",
    });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe("Client created successfully");
  });

  it("should login a client", async () => {
    const response = await request(app).post("/api/auth/login").send({
      email: "test@test.com",
      password: "testpassword",
    });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Login successful");
  });

  it("should logout a client", async () => {
    const response = await request(app).post("/api/auth/logout");

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Logout successful");
  });
});
