import request from "supertest";
import mongoose from "mongoose";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import app from "../server";
import YourLogo from "../models/Yourlogo";
import Auth from "../models/Auth";

dotenv.config();

let token: string;
let logoId: string;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_TEST_URL!);

  const hashedPassword = await bcrypt.hash("test1234", 10);
  const user = await Auth.create({
    name: "Logo Admin",
    email: "logo.admin@example.com",
    password: hashedPassword,
    role: "senior",
  });

  token = jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN_SECRET!, {
    expiresIn: "1h",
  });
});

afterAll(async () => {
  await YourLogo.deleteMany();
  await Auth.deleteMany();
  await mongoose.connection.close();
});

describe("YourLogo API", () => {
  it("should create a logo", async () => {
    const res = await request(app)
      .post("/api/yourlogo")
      .set("Cookie", [`accessToken=${token}`])
      .send({
        name: "Test Company",
        image: "https://example.com/logo.png",
      });

    expect(res.status).toBe(201);
    expect(res.body.message).toBe("Your logo created successfully");
    expect(res.body.data).toHaveProperty("_id");
    logoId = res.body.data._id;
  });

  it("should get all logos", async () => {
    const res = await request(app).get("/api/yourlogo");
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Your logo fetched successfully");
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  it("should update a logo", async () => {
    const res = await request(app)
      .put(`/api/yourlogo/${logoId}`)
      .set("Cookie", [`accessToken=${token}`])
      .send({ name: "Updated Company" });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Your logo updated successfully");
    expect(res.body.data.name).toBe("Updated Company");
  });

  it("should return 404 when updating non-existing logo", async () => {
    const res = await request(app)
      .put(`/api/yourlogo/000000000000000000000000`)
      .set("Cookie", [`accessToken=${token}`])
      .send({ name: "Fake Logo" });

    expect(res.status).toBe(404);
    expect(res.body.message).toBe("Your logo not found");
  });

  it("should delete a logo", async () => {
    const res = await request(app)
      .delete(`/api/yourlogo/${logoId}`)
      .set("Cookie", [`accessToken=${token}`]);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Your logo deleted successfully");
  });

  it("should return 404 when deleting non-existing logo", async () => {
    const res = await request(app)
      .delete(`/api/yourlogo/${logoId}`)
      .set("Cookie", [`accessToken=${token}`]);

    expect(res.status).toBe(404);
    expect(res.body.message).toBe("Your logo not found");
  });
});
