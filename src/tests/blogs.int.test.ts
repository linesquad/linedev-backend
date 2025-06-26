import request from "supertest";
import mongoose from "mongoose";
import app from "../server";
import Blog from "../models/Blogs";
import Auth from "../models/Auth";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

let token: string;
let blogId: string;
let userId: string;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_TEST_URL!);


  const password = await bcrypt.hash("password123", 10);
  const user = await Auth.create({
    name: "Test Middle User",
    email: "middle@example.com",
    password,
    role: "middle",
  });
  userId = user._id.toString();

  // Create JWT token
  token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.ACCESS_TOKEN_SECRET!,
    {
      expiresIn: "1h",
    }
  );
});

afterAll(async () => {
  await Blog.deleteMany({});
  await Auth.deleteMany({});
  await mongoose.connection.close();
});

describe("📝 Blog API", () => {
  test("POST /api/blogs - should create a blog (protected)", async () => {
    const res = await request(app)
      .post("/api/blogs")
      .set("Cookie", [`accessToken=${token}`])
      .send({
        title: "Test Blog",
        content: "This is a test blog content.",
        author: userId,
        tags: ["test", "blog"],
        category: "Tech",
        image: "https://example.com/image.jpg",
        isFeatured: true,
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.data.title).toBe("Test Blog");
    blogId = res.body.data._id;
  });

  test("GET /api/blogs - should fetch all blogs (public)", async () => {
    const res = await request(app).get("/api/blogs");

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.blogs)).toBe(true);
    expect(res.body.total).toBeGreaterThanOrEqual(1);
  });

  test("GET /api/blogs/:id - should fetch blog by ID and increment views (public)", async () => {
    const res = await request(app).get(`/api/blogs/${blogId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.data._id).toBe(blogId);
    expect(res.body.data.views).toBe(1); 
  });

  test("PUT /api/blogs/:id - should update blog by ID (protected)", async () => {
    const res = await request(app)
      .put(`/api/blogs/${blogId}`)
      .set("Cookie", [`accessToken=${token}`])
      .send({
        title: "Updated Blog Title",
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.data.title).toBe("Updated Blog Title");
  });

  test("DELETE /api/blogs/:id - should delete blog by ID (protected)", async () => {
    const res = await request(app)
      .delete(`/api/blogs/${blogId}`)
      .set("Cookie", [`accessToken=${token}`]);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Blog deleted successfully");
  });
});
