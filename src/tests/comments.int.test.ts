import request from "supertest";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import app from "../server";
import Auth from "../models/Auth";
import Blog from "../models/Blogs";
import Comment from "../models/Comment";

dotenv.config();

let userToken: string;
let seniorToken: string;
let blogId: string;
let commentId: string;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_TEST_URL!);

  const userPassword = await bcrypt.hash("user123", 10);
  const user = await Auth.create({
    name: "Client User",
    email: "client@example.com",
    password: userPassword,
    role: "client",
  });

  userToken = jwt.sign(
    { id: user._id, role: "user" },
    process.env.ACCESS_TOKEN_SECRET!,
    {
      expiresIn: "1h",
    }
  );

  const seniorPassword = await bcrypt.hash("senior123", 10);
  const senior = await Auth.create({
    name: "Senior",
    email: "senior@example.com",
    password: seniorPassword,
    role: "senior",
  });

  seniorToken = jwt.sign(
    { id: senior._id, role: "senior" },
    process.env.ACCESS_TOKEN_SECRET!,
    {
      expiresIn: "1h",
    }
  );

  const blog = await Blog.create({
    title: "Test Blog",
    content: "Some content",
    author: senior._id,
    tags: ["test"],
    category: "general",
  });

  blogId = blog._id.toString();
});

afterAll(async () => {
  await Comment.deleteMany({});
  await Blog.deleteMany({});
  await Auth.deleteMany({});
  await mongoose.connection.close();
});

describe("💬 Comment API", () => {
  test("POST /api/comment - create a comment (auth)", async () => {
    const res = await request(app)
      .post("/api/comment")
      .set("Cookie", [`accessToken=${userToken}`])
      .send({
        blog: blogId,
        name: "Test User",
        content: "This is a test comment",
        approved: false,
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.comment).toHaveProperty("_id");
    expect(res.body.comment.approved).toBe(false);
    commentId = res.body.comment._id;
  });

  test("GET /api/comment/:blogId - get approved comments (auth)", async () => {
    const res = await request(app)
      .get(`/api/comment/${blogId}`)
      .set("Cookie", [`accessToken=${userToken}`]);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.comments)).toBe(true);
    expect(res.body.comments).toHaveLength(0);
  });

  test("GET /api/comment - get all comments (senior only)", async () => {
    const res = await request(app)
      .get("/api/comment")
      .set("Cookie", [`accessToken=${seniorToken}`]);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.comments)).toBe(true);

    if (res.body.comments.length > 0) {
      expect(res.body.comments[0]).toHaveProperty("content");
    }
  });

  test("PATCH /api/comment/:id - approve comment (senior only)", async () => {
    const res = await request(app)
      .patch(`/api/comment/${commentId}`)
      .set("Cookie", [`accessToken=${seniorToken}`])
      .send({ approved: true });

    expect(res.statusCode).toBe(200);
    expect(res.body.comment.approved).toBe(true);
  });

  test("GET /api/comment/:blogId - should now return 1 approved comment", async () => {
    const res = await request(app)
      .get(`/api/comment/${blogId}`)
      .set("Cookie", [`accessToken=${userToken}`]);

    expect(res.statusCode).toBe(200);
    expect(res.body.comments.length).toBe(1);
  });

  test("DELETE /api/comment/:id - delete comment (senior only)", async () => {
    const res = await request(app)
      .delete(`/api/comment/${commentId}`)
      .set("Cookie", [`accessToken=${seniorToken}`]);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Comment deleted successfully");
  });
});
