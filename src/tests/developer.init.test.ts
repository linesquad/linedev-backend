import request from "supertest";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import app from "../server";
import Developer from "../models/developer";
import Auth from "../models/Auth";

dotenv.config();

let token: string;
let developerId: string;
let fakeId: string;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_TEST_URL!);

  const client = await Auth.create({
    name: "Client User",
    email: "client@example.com",
    password: "securepass",
    role: "client",
  });

  token = jwt.sign({ id: client._id }, process.env.ACCESS_TOKEN_SECRET!, {
    expiresIn: "1h",
  });

  fakeId = new mongoose.Types.ObjectId().toString();
});

afterAll(async () => {
  await Developer.deleteMany();
  await Auth.deleteMany();
  await mongoose.disconnect();
});

describe("Developer API", () => {
  it("should create a developer", async () => {
    const res = await request(app)
      .post("/api/developers")
      .set("Cookie", [`accessToken=${token}`])
      .send({
        name: "Jane Dev",
        rank: "junior",
        bio: "React Developer",
        skills: ["JavaScript", "React"],
        profileImage: "https://example.com/jane.png",
      });

    expect(res.status).toBe(201);
    expect(res.body.data.name).toBe("Jane Dev");
    developerId = res.body.data._id;
  });

  it("should fetch all developers", async () => {
    const res = await request(app).get("/api/developers");

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  it("should fetch a developer by id", async () => {
    const res = await request(app).get(`/api/developers/${developerId}`);

    expect(res.status).toBe(200);
    expect(res.body.data._id).toBe(developerId);
  });

  it("should return 404 if developer not found", async () => {
    const res = await request(app).get(`/api/developers/${fakeId}`);
    expect(res.status).toBe(404);
  });

  it("should update a developer", async () => {
    const res = await request(app)
      .put(`/api/developers/${developerId}`)
      .set("Cookie", [`accessToken=${token}`])
      .send({
        bio: "Updated Bio",
        skills: ["Node.js", "MongoDB"],
      });

    expect(res.status).toBe(200);
    expect(res.body.data.bio).toBe("Updated Bio");
    expect(res.body.data.skills).toContain("Node.js");
  });

  it("should return 404 when updating non-existent developer", async () => {
    const res = await request(app)
      .put(`/api/developers/${fakeId}`)
      .set("Cookie", [`accessToken=${token}`])
      .send({ bio: "Not found" });

    expect(res.status).toBe(404);
  });

  it("should delete a developer", async () => {
    const res = await request(app)
      .delete(`/api/developers/${developerId}`)
      .set("Cookie", [`accessToken=${token}`]);

    expect(res.status).toBe(200);
  });

  it("should return 404 when deleting non-existent developer", async () => {
    const res = await request(app)
      .delete(`/api/developers/${fakeId}`)
      .set("Cookie", [`accessToken=${token}`]);

    expect(res.status).toBe(404);
  });

  it("should block unauthenticated creation", async () => {
    const res = await request(app).post("/api/developers").send({
      name: "Unauth",
      rank: "junior",
      bio: "No auth",
      skills: [],
      profileImage: "https://example.com/no.png",
    });

    expect(res.status).toBe(401);
  });
});
