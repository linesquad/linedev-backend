import request from "supertest";
import app from "../server";
import mongoose from "mongoose";
import { createTestAccount } from "./utils/createTestAccount";

let seniorToken: string;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URL!);

  const seniorAccount = await createTestAccount("senior");
  seniorToken = seniorAccount.accessToken;
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

describe("Courses API", () => {
  let id: string;
  it("should create a course", async () => {
    const res = await request(app)
      .post("/api/courses")
      .set("Cookie", `accessToken=${seniorToken}`)
      .send({
        title: "Test Course",
        description: "Test Description",
        duration: "1 hour",
        level: "beginner",
        price: 100,
        tags: ["test", "course"],
        syllabus: [
          {
            title: "Test Course",
            description: "Test Description",
            week: "1",
          },
        ],
      });
    expect(res.status).toBe(201);
    expect(res.body.message).toBe("Course created successfully");
    id = res.body.data._id;
  });

  it("should get all courses", async () => {
    const res = await request(app)
      .get("/api/courses")
      .set("Cookie", `accessToken=${seniorToken}`);
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Courses fetched successfully");
  });

  it("should get a course by id", async () => {
    const res = await request(app)
      .get(`/api/courses/${id}`)
      .set("Cookie", `accessToken=${seniorToken}`);
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Course fetched successfully");
    expect(res.body.data.syllabus).toBeDefined();
  });

  it("should update a course", async () => {
    const res = await request(app)
      .put(`/api/courses/${id}`)
      .set("Cookie", `accessToken=${seniorToken}`)
      .send({
        title: "Updated Course",
        description: "Updated Description",
        duration: "2 hours",
      });
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Course updated successfully");
    expect(res.body.data.syllabus).toBeDefined();
  });

  it("should delete a course", async () => {
    const res = await request(app)
      .delete(`/api/courses/${id}`)
      .set("Cookie", `accessToken=${seniorToken}`);
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Course deleted successfully");
  });
});
