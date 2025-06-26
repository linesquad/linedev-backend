import request from "supertest";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import app from "../server";
import Auth from "../models/Auth";

dotenv.config();

let seniorToken: string;
let userId: string;
let unusedId: string;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_TEST_URL!);

  const hashed = await bcrypt.hash("test1234", 10);

  const user = await Auth.create({
    name: "Skillful Dev",
    email: "dev@example.com",
    password: hashed,
    role: "junior",
    skills: ["JavaScript"],
    badges: [],
  });
  userId = user._id.toString();
  unusedId = new mongoose.Types.ObjectId().toString();

  // Create a senior user and token
  const senior = await Auth.create({
    name: "Senior Admin",
    email: "admin@example.com",
    password: hashed,
    role: "senior",
  });

  seniorToken = jwt.sign({ id: senior._id }, process.env.ACCESS_TOKEN_SECRET!, {
    expiresIn: "1h",
  });
});

afterAll(async () => {
  await Auth.deleteMany();
  await mongoose.connection.close();
});

describe("Badge and Skills API", () => {
  it("should update user skills (merge + deduplicate)", async () => {
    const res = await request(app)
      .patch(`/api/users/${userId}/skills`)
      .set("Cookie", [`accessToken=${seniorToken}`])
      .send({
        skills: ["TypeScript", "JavaScript"],
      });

    expect(res.status).toBe(200);
    expect(res.body.auth.skills).toEqual(
      expect.arrayContaining(["JavaScript", "TypeScript"])
    );
  });

  it("should add a new badge", async () => {
    const res = await request(app)
      .patch(`/api/users/${userId}/badges`)
      .set("Cookie", [`accessToken=${seniorToken}`])
      .send({
        title: "Code Hero",
        description: "Completed 100 tasks",
        iconUrl: "https://example.com/badge1.svg",
      });

    expect(res.status).toBe(200);
    expect(res.body.auth.badges.length).toBe(1);
    expect(res.body.auth.badges[0].title).toBe("Code Hero");
  });

  it("should not allow adding duplicate badge title", async () => {
    const res = await request(app)
      .patch(`/api/users/${userId}/badges`)
      .set("Cookie", [`accessToken=${seniorToken}`])
      .send({
        title: "Code Hero",
        description: "Another award",
        iconUrl: "https://example.com/badge2.svg",
      });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Badge already exists");
  });

  it("should return 404 when updating skills of non-existing user", async () => {
    const res = await request(app)
      .patch(`/api/users/${unusedId}/skills`)
      .set("Cookie", [`accessToken=${seniorToken}`])
      .send({ skills: ["Docker"] });

    expect(res.status).toBe(404);
    expect(res.body.message).toBe("User not found");
  });

  it("should return 404 when adding badge to non-existing user", async () => {
    const res = await request(app)
      .patch(`/api/users/${unusedId}/badges`)
      .set("Cookie", [`accessToken=${seniorToken}`])
      .send({
        title: "Legend",
        description: "Never seen",
        iconUrl: "https://example.com/legend.svg",
      });

    expect(res.status).toBe(404);
    expect(res.body.message).toBe("User not found");
  });

  it("should reject access if not authenticated", async () => {
    const res = await request(app)
      .patch(`/api/users/${userId}/skills`)
      .send({
        skills: ["Unauthorized Skill"],
      });

    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Unauthorized");
  });
});
