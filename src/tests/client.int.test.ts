import request from "supertest";
import mongoose from "mongoose";
import app from "../server";
import Client from "../models/Client";
import Auth from "../models/Auth";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

let accessToken: string;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_TEST_URL!);

  const password = await bcrypt.hash("password123", 10);
  const user = await Auth.create({
    name: "Test Senior",
    email: "testsenior@example.com",
    password,
    role: "senior",
  });

  accessToken = jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN_SECRET!, {
    expiresIn: "1h",
  });
});

afterAll(async () => {
  await Auth.deleteMany({});
  await Client.deleteMany({});
  await mongoose.disconnect();
});

describe("Client API", () => {
  let clientId: string;

  it("POST /api/client - should create client", async () => {
    const res = await request(app)
      .post("/api/client")
      .send({
        name: "John Doe",
        email: "john@example.com",
        company: "Test Co",
        phone: "599123456",
        services: ["service1", "service2"],
        message: "This is a test message",
      });

    expect(res.status).toBe(201);
    expect(res.body.message).toBe("Client created successfully");
    expect(typeof res.body.data).toBe("object");
    expect(res.body.data).not.toEqual({});

    clientId = res.body.data._id; // ინიციალიზაცია
    expect(clientId).toBeDefined();
  });

  it("GET /api/client - should fail without token", async () => {
    const res = await request(app).get("/api/client");
    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Unauthorized");
  });

  it("GET /api/client - should get clients with token and role senior", async () => {
    const res = await request(app)
      .get("/api/client")
      .set("Cookie", [`accessToken=${accessToken}`]);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Clients fetched successfully");
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it("DELETE /api/client/:id - should delete client with token and role senior", async () => {
    console.log("clientId before delete:", clientId);

    const res = await request(app)
      .delete(`/api/client/${clientId}`)
      .set("Cookie", [`accessToken=${accessToken}`]);

    console.log("DELETE response:", res.status, res.body);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Client deleted successfully");
  });

  it("DELETE /api/client/:id - should return 404 if client not found", async () => {
    const fakeId = new mongoose.Types.ObjectId().toString();
    const res = await request(app)
      .delete(`/api/client/${fakeId}`)
      .set("Cookie", [`accessToken=${accessToken}`]);

    expect(res.status).toBe(404);
    expect(res.body.message).toBe("Client not found");
  });
});
