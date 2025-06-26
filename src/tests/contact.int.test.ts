import request from "supertest";
import mongoose from "mongoose";
import app from "../server";
import Contact from "../models/Contact";
import Auth from "../models/Auth";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

let seniorToken: string;
let contactId: string;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_TEST_URL!);

  const hashedPassword = await bcrypt.hash("password123", 10);
  const user = await Auth.create({
    name: "Senior User",
    email: "senior@example.com",
    password: hashedPassword,
    role: "senior",
  });

  seniorToken = jwt.sign(
    { id: user._id, role: "senior" },
    process.env.ACCESS_TOKEN_SECRET!,
    { expiresIn: "1h" }
  );
});

afterAll(async () => {
  await Auth.deleteMany({});
  await Contact.deleteMany({});
  await mongoose.connection.close();
});

describe("📬 Contact API", () => {
  test("POST /api/contact - create a new contact (public)", async () => {
    const res = await request(app).post("/api/contact").send({
      name: "John Doe",
      email: "john@example.com",
      subject: "Test Subject",
      message: "This is a test message with more than 10 chars.",
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.contact).toHaveProperty("_id");
    contactId = res.body.contact._id;
  });

  test("GET /api/contact - fetch contacts (only for senior)", async () => {
    const res = await request(app)
      .get("/api/contact")
      .set("Cookie", [`accessToken=${seniorToken}`]);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.contacts)).toBe(true);
  });

  test("PATCH /api/contact/:id/status - update contact status (only for senior)", async () => {
    const res = await request(app)
      .patch(`/api/contact/${contactId}/status`)
      .set("Cookie", [`accessToken=${seniorToken}`])
      .send({ status: "responded" });

    expect(res.statusCode).toBe(200);
    expect(res.body.data.status).toBe("responded");
  });

  test("DELETE /api/contact/:id - delete a contact (only for senior)", async () => {
    const res = await request(app)
      .delete(`/api/contact/${contactId}`)
      .set("Cookie", [`accessToken=${seniorToken}`]);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Contact deleted successfully");
  });
});
