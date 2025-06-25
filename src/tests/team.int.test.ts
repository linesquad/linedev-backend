import request from "supertest";
import mongoose, { Types } from "mongoose";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import app from "../server";
import Auth from "../models/Auth";
import Team from "../models/Team";

dotenv.config();

let token: string;
let teamId: string;
let unusedId: string;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_TEST_URL!);

  // Create a test senior user
  const hashedPassword = await bcrypt.hash("test1234", 10);
  const user = await Auth.create({
    name: "Team Manager",
    email: "team.manager@example.com",
    password: hashedPassword,
    role: "senior",
  });

  token = jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN_SECRET!, {
    expiresIn: "1h",
  });

  // Generate a valid unused ObjectId
  unusedId = new Types.ObjectId().toHexString();
});

afterAll(async () => {
  await Team.deleteMany();
  await Auth.deleteMany();
  await mongoose.connection.close();
});

describe("Team API", () => {
  it("should create a new team member", async () => {
    const res = await request(app)
      .post("/api/team")
      .set("Cookie", [`accessToken=${token}`])
      .send({
        name: "Jane Developer",
        bio: "Frontend engineer",
        rank: "A",
        skills: ["React", "TypeScript"],
        image: "https://example.com/jane.jpg",
        projectUrl: ["https://github.com/jane"],
        projectImages: ["https://example.com/project.jpg"],
      });

    expect(res.status).toBe(201);
    expect(res.body.message).toBe("Team created successfully");
    teamId = res.body.data._id;
  });

  it("should get all team members", async () => {
    const res = await request(app).get("/api/team");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  it("should get team members filtered by rank", async () => {
    const res = await request(app).get("/api/team?rank=A");
    expect(res.status).toBe(200);
    expect(res.body.data.every((member: any) => member.rank === "A")).toBe(
      true
    );
  });

  it("should update the team member", async () => {
    const res = await request(app)
      .put(`/api/team/${teamId}`)
      .set("Cookie", [`accessToken=${token}`])
      .send({
        bio: "Full-stack engineer",
        rank: "S",
      });

    expect(res.status).toBe(200);
    expect(res.body.data.bio).toBe("Full-stack engineer");
    expect(res.body.data.rank).toBe("S");
  });

  it("should fail to update non-existing team member", async () => {
    const res = await request(app)
      .put(`/api/team/${unusedId}`)
      .set("Cookie", [`accessToken=${token}`])
      .send({
        bio: "Ghost team member",
      });

    expect(res.status).toBe(404);
    expect(res.body.message).toBe("Team not found");
  });

  it("should delete the team member", async () => {
    const res = await request(app)
      .delete(`/api/team/${teamId}`)
      .set("Cookie", [`accessToken=${token}`]);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Team deleted successfully");
  });

  it("should fail to delete non-existing team member", async () => {
    const res = await request(app)
      .delete(`/api/team/${unusedId}`)
      .set("Cookie", [`accessToken=${token}`]);

    expect(res.status).toBe(404);
    expect(res.body.message).toBe("Team not found");
  });
});
