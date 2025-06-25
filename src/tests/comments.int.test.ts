import request from "supertest";
import mongoose from "mongoose";
import app from "../server";
import Comment from "../models/Comment";
import Auth from "../models/Auth";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

let accessTokenSenior: string;
let accessTokenUser: string;
let commentId: string;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_TEST_URL!);

  const passwordSenior = await bcrypt.hash("password123", 10);
  const seniorUser = await Auth.create({
    name: "Senior User",
    email: "senior@example.com",
    password: passwordSenior,
    role: "senior",
  });

  accessTokenSenior = jwt.sign(
    { id: seniorUser._id },
    process.env.ACCESS_TOKEN_SECRET!,
    {
      expiresIn: "1h",
    }
  );

  const passwordUser = await bcrypt.hash("password123", 10);
  const normalUser = await Auth.create({
    name: "Normal User",
    email: "user@example.com",
    password: passwordUser,
    role: "client",
  });

  accessTokenUser = jwt.sign(
    { id: normalUser._id },
    process.env.ACCESS_TOKEN_SECRET!,
    {
      expiresIn: "1h",
    }
  );
});

afterAll(async () => {
  await Auth.deleteMany({});
  await Comment.deleteMany({});
  await mongoose.disconnect();
});

describe("Comment API", () => {
  const blogId = new mongoose.Types.ObjectId().toString();

  it("POST /api/comment - should create comment (auth required)", async () => {
    const res = await request(app)
      .post("/api/comment")
      .set("Cookie", [`accessToken=${accessTokenUser}`])
      .send({
        name: "Test Commenter",
        content: "This is a test comment",
        approved: false,
      });

    expect(res.status).toBe(201);
    expect(res.body.message).toBe("Comment created successfully");
    expect(res.body.comment).toHaveProperty("_id");
    commentId = res.body.comment._id;
  });

  it("GET /api/comment - should fail without senior role", async () => {
    const res = await request(app).get("/api/comment");
    expect(res.status).toBe(401);
  });

  it("GET /api/comment - should get all comments with senior role", async () => {
    const res = await request(app)
      .get("/api/comment")
      .set("Cookie", [`accessToken=${accessTokenSenior}`]);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.comments)).toBe(true);
  });

  it("GET /api/comment/:blogId - should get approved comments (auth required)", async () => {
    const res = await request(app)
      .get(`/api/comment/${blogId}`)
      .set("Cookie", [`accessToken=${accessTokenUser}`]);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.comments)).toBe(true);
  });

  it("PATCH /api/comment/:id - should approve comment (senior role required)", async () => {
    const res = await request(app)
      .patch(`/api/comment/${commentId}`)
      .set("Cookie", [`accessToken=${accessTokenSenior}`])
      .send({ approved: true });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Comment approved successfully");
    expect(res.body.comment.approved).toBe(true);
  });

  it("DELETE /api/comment/:id - should delete comment (senior role required)", async () => {
    const res = await request(app)
      .delete(`/api/comment/${commentId}`)
      .set("Cookie", [`accessToken=${accessTokenSenior}`]);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Comment deleted successfully");
  });
});
