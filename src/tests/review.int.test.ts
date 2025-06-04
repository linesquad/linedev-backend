import request from "supertest";
import app from "../server";
import mongoose from "mongoose";
import { createTestAccount } from "./utils/createTestAccount";

let seniorToken: string;
let seniorUserId: string;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_TEST_URL!);
  const seniorAccount = await createTestAccount("senior");
  seniorToken = seniorAccount.accessToken;
  seniorUserId = seniorAccount.account._id.toString();
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

describe("Review API", () => {
  let courseId: string;
  let reviewId: string;
  it("should create a course", async () => {
    const response = await request(app)
      .post("/api/courses")
      .set("Cookie", `accessToken=${seniorToken}`)
      .send({
        title: "Test Course",
        description: "Test Description",
        duration: "8 weeks",
        level: "beginner",
        price: 100,
        tags: ["Programming", "Web Development"],
        syllabus: [
          {
            title: "Introduction",
            description: "Introduction to the course",
            week: "Week 1",
          },
        ],
      });

    expect(response.status).toBe(201);
    expect(response.body.data).toBeDefined();
    courseId = response.body.data._id;
  });

  it("should create a review", async () => {
    const response = await request(app)
      .post("/api/reviews")
      .set("Cookie", `accessToken=${seniorToken}`)
      .send({
        course: courseId,
        rating: 5,
        comment: "Test Comment",
        user: seniorUserId
      });

    expect(response.status).toBe(201);
    expect(response.body.data).toBeDefined();
    reviewId = response.body.data._id;
  });

  it("should get all reviews by course id", async () => {
    const response = await request(app).get(`/api/reviews/${courseId}`);

    expect(response.status).toBe(200);
    expect(response.body.data).toBeDefined();
    expect(response.body.data.length).toBeGreaterThan(0);
  });

  it("should update a review", async () => {
    const response = await request(app)
      .put(`/api/reviews/${reviewId}`)
      .set("Cookie", `accessToken=${seniorToken}`)
      .send({ comment: "Updated Comment" });

    expect(response.status).toBe(200);
    expect(response.body.data).toBeDefined();
  });

  it("should delete a review", async () => {
    const response = await request(app)
      .delete(`/api/reviews/${reviewId}`)
      .set("Cookie", `accessToken=${seniorToken}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Review deleted successfully");
  });
});
