import dotenv from "dotenv";

import request from "supertest";
import mongoose from "mongoose";
import app from "../server";
import Blog from "../models/Blogs";
import Auth from "../models/Auth";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

dotenv.config();

let accessToken: string;
let blogId: string;

beforeAll(async () => {
  if (!process.env.MONGO_TEST_URL) {
    throw new Error("❌ MONGO_TEST_URL is not defined!");
  }

  await mongoose.connect(process.env.MONGO_TEST_URL);

  await Auth.deleteMany({});
  await Blog.deleteMany({});

  const hashedPassword = await bcrypt.hash("password123", 10);
  const user = await Auth.create({
    name: "Test User",
    email: "test@example.com",
    password: hashedPassword,
    role: "senior",
  });

  accessToken = jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN_SECRET!, {
    expiresIn: "1h",
  });
});

afterAll(async () => {
  await Blog.deleteMany({ title: /Test Blog/i });
  await Auth.deleteOne({ email: "test@example.com" });
  await mongoose.connection.close();
});

describe("📚 Blog API Integration", () => {
  it("should create a new blog", async () => {
    const res = await request(app)
      .post("/api/blogs")
      .set("Cookie", [`accessToken=${accessToken}`])
      .send({
        title: "Test Blog",
        content: "This is a test blog.",
        author: "Test User",
        tags: ["node", "express"],
        category: "tech",
        image: "https://example.com/image.jpg",
        isFeatured: true,
      });

    expect(res.status).toBe(201);
    expect(res.body.message).toBe("Blog created successfully");
    expect(res.body.data.title).toBe("Test Blog");
    blogId = res.body.data._id;
  });

  it("should fetch all blogs", async () => {
    const res = await request(app).get("/api/blogs");

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Blogs fetched successfully");
    expect(Array.isArray(res.body.blogs)).toBe(true);
    expect(res.body.blogs.length).toBeGreaterThan(0);
  });

  it("should fetch a blog by ID and increase views", async () => {
    const res = await request(app).get(`/api/blogs/${blogId}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Blog fetched successfully");
    expect(res.body.data._id).toBe(blogId);
    expect(res.body.data.views).toBe(1);
  });

  it("should update a blog by ID", async () => {
    const res = await request(app)
      .put(`/api/blogs/${blogId}`)
      .set("Cookie", [`accessToken=${accessToken}`])
      .send({
        title: "Updated Blog Title",
      });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Blog updated successfully");
    expect(res.body.data.title).toBe("Updated Blog Title");
  });

  it("should delete a blog by ID", async () => {
    const res = await request(app)
      .delete(`/api/blogs/${blogId}`)
      .set("Cookie", [`accessToken=${accessToken}`]);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Blog deleted successfully");
  });
});
