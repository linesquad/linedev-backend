import request from "supertest";
import mongoose from "mongoose";
import app from "../server";
import Auth from "../models/Auth";
import Course from "../models/Courses";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

let token: string;
let courseId: string;
let userId: string;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_TEST_URL!);

  // Create test user with 'middle' role
  const password = await bcrypt.hash("password123", 10);
  const user = await Auth.create({
    name: "Test Middle User",
    email: "middle@example.com",
    password,
    role: "middle",
  });
  userId = user._id.toString();

  token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.ACCESS_TOKEN_SECRET!,
    {
      expiresIn: "1h",
    }
  );
});

afterAll(async () => {
  await Course.deleteMany({});
  await Auth.deleteMany({});
  await mongoose.connection.close();
});

describe("📚 Course API", () => {
  test("POST /api/courses - should create a course (auth)", async () => {
    const res = await request(app)
      .post("/api/courses")
      .set("Cookie", [`accessToken=${token}`])
      .send({
        title: "React for Beginners",
        description: "Intro to React",
        duration: "6 weeks",
        level: "beginner",
        price: 199,
        tags: ["react", "frontend"],
        syllabus: [
          {
            title: "Week 1",
            description: "JSX and Components",
            week: "1",
          },
        ],
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.data).toHaveProperty("_id");
    expect(res.body.data.title).toBe("React for Beginners");
    courseId = res.body.data._id;
  });

  test("GET /api/courses - should fetch all courses (public)", async () => {
    const res = await request(app).get("/api/courses");

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data[0]).toHaveProperty("title");
  });

  test("GET /api/courses/:id - should fetch course by ID (public)", async () => {
    const res = await request(app).get(`/api/courses/${courseId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data._id).toBe(courseId);
  });

  test("PUT /api/courses/:id - should update course (auth)", async () => {
    const res = await request(app)
      .put(`/api/courses/${courseId}`)
      .set("Cookie", [`accessToken=${token}`])
      .send({ price: 249 });

    expect(res.statusCode).toBe(200);
    expect(res.body.data.price).toBe(249);
  });

  test("DELETE /api/courses/:id - should delete course (auth)", async () => {
    const res = await request(app)
      .delete(`/api/courses/${courseId}`)
      .set("Cookie", [`accessToken=${token}`]);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Course deleted successfully");
  });
});
