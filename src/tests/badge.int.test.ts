import request from "supertest";
import mongoose from "mongoose";
import app from "../server"; // შენი express აპი
import Auth from "../models/Auth";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

let token: string;
let userId: string;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_TEST_URL!);

  // შექმენი ტესტი მომხმარებელი
  const user = await Auth.create({
    name: "Badge Tester",
    email: "badge.tester@example.com",
    password: "hashedpassword",
    badges: [],
    role: "senior",
  });

  userId = user._id.toString();

  // გენერირება JWT ტოკენის
  token = jwt.sign(
    { id: userId, role: "senior" },
    process.env.ACCESS_TOKEN_SECRET || "secret",
    { expiresIn: "1h" }
  );
});

afterAll(async () => {
  await Auth.deleteMany({ email: "badge.tester@example.com" });
  await mongoose.disconnect();
});

describe("PATCH /:id/badges", () => {
  it("should add a new badge", async () => {
    const res = await request(app)
      .patch(`/api/users/${userId}/badges`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Top Contributor",
        description: "Awarded for contributing a lot",
        iconUrl: "https://example.com/icon.png",
      });

    expect(res.status).toBe(200);
    expect(
      res.body.auth.badges.some((b: any) => b.title === "Top Contributor")
    ).toBe(true);
  });

  it("should not add duplicate badge", async () => {
    // თავდაპირველად დავამატოთ badge
    await request(app)
      .patch(`/api/users/${userId}/badges`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Duplicate Badge",
        description: "desc",
        iconUrl: "https://example.com/icon.png",
      });

    // მეორედ იგივე სათაური არ უნდა დაუმატოს
    const res = await request(app)
      .patch(`/api/users/${userId}/badges`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Duplicate Badge",
        description: "desc2",
        iconUrl: "https://example.com/icon2.png",
      });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Badge already exists");
  });

  it("should return 404 if user not found", async () => {
    const invalidId = new mongoose.Types.ObjectId().toString();
    const res = await request(app)
      .patch(`/api/users/${invalidId}/badges`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Nonexistent User Badge",
        description: "desc",
        iconUrl: "https://example.com/icon.png",
      });

    expect(res.status).toBe(404);
  });
});
