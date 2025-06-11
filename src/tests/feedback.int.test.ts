import request from "supertest";
import app from "../server";
import mongoose from "mongoose";
import { createTestAccount } from "./utils/createTestAccount";
import Auth from "../models/Auth";
import Task from "../models/Tasks";



let juniorToken: string;
let middleToken: string;
let seniorToken: string;
let seniorUserId: string;
let juniorUserId: string;
let middleUserId: string;
let taskId: string;
let feedbackId: string;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_TEST_URL!);
  // Clean up before tests
  await Auth.deleteMany({});
  await Task.deleteMany({});

  const juniorAccount = await createTestAccount("junior");
  juniorToken = juniorAccount.accessToken;
  juniorUserId = juniorAccount.account._id.toString();

  const middleAccount = await createTestAccount("middle");
  middleToken = middleAccount.accessToken;
  middleUserId = middleAccount.account._id.toString();

  const seniorAccount = await createTestAccount("senior");
  seniorToken = seniorAccount.accessToken;
  seniorUserId = seniorAccount.account._id.toString();
}, 30000);

afterAll(async () => {
  // Clean up everything after all tests
  await Auth.deleteMany({});
  await Task.deleteMany({});
  await mongoose.connection.close();
});

describe("feedback functionality", () => {
  beforeEach(async () => {
    // Create a fresh task before each test
    const res = await request(app)
      .post("/api/tasks")
      .send({
        title: "Test Task",
        description: "Test Description",
        status: "pending",
        dueDate: new Date().toISOString(),
        assignedTo: seniorUserId,
        subtasks: [{ title: "Subtask 1", done: false }],
        priority: "low",
      })
      .set("Cookie", `accessToken=${seniorToken}`);
    expect(res.status).toBe(201);
    taskId = res.body.task._id;
  });

  afterEach(async () => {
    // Clean up tasks after each test
    await Task.deleteMany({});
  });

  it("should not allow junior to add feedback", async () => {
    const res = await request(app)
      .post(`/api/tasks/${taskId}/feedback`)
      .send({
        comment: "Test Feedback",
        author: juniorUserId,
      })
      .set("Cookie", `accessToken=${juniorToken}`);
    expect(res.status).toBe(403);
  });

  it("should not allow middle to add feedback", async () => {
    const res = await request(app)
      .post(`/api/tasks/${taskId}/feedback`)
      .send({
        comment: "Test Feedback",
        author: middleUserId,
      })
      .set("Cookie", `accessToken=${middleToken}`);
    expect(res.status).toBe(403);
  });

  it("should require comment and author", async () => {
    const res = await request(app)
      .post(`/api/tasks/${taskId}/feedback`)
      .send({})
      .set("Cookie", `accessToken=${seniorToken}`);
    expect(res.status).toBe(400);
  });

  it("should allow senior to add feedback", async () => {
    const res = await request(app)
      .post(`/api/tasks/${taskId}/feedback`)
      .send({
        comment: "Test Feedback",
        author: juniorUserId,
      })
      .set("Cookie", `accessToken=${seniorToken}`);
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Feedback added successfully");
    expect(res.body.taskFeedback).toBeDefined();
    expect(res.body.taskFeedback.feedback).toBeDefined();
    expect(res.body.taskFeedback.feedback[0].comment).toBe("Test Feedback");
    expect(res.body.taskFeedback.feedback[0].author.toString()).toBe(
      juniorUserId
    );
    feedbackId = res.body.taskFeedback.feedback[0]._id;
  });

  it("should allow everyone to get feedback", async () => {
    // First add some feedback
    await request(app)
      .post(`/api/tasks/${taskId}/feedback`)
      .send({
        comment: "Test Feedback",
        author: juniorUserId,
      })
      .set("Cookie", `accessToken=${seniorToken}`);

    // Then try to get it with different roles
    const resJunior = await request(app)
      .get(`/api/tasks/${taskId}/feedback`)
      .set("Cookie", `accessToken=${juniorToken}`);
    expect(resJunior.status).toBe(200);
    expect(resJunior.body.message).toBe("Feedback fetched successfully");
    expect(resJunior.body.feedback).toBeDefined();
    expect(Array.isArray(resJunior.body.feedback)).toBe(true);
    expect(resJunior.body.feedback.length).toBeGreaterThan(0);
    expect(resJunior.body.feedback[0].comment).toBe("Test Feedback");
    expect(resJunior.body.feedback[0].author.toString()).toBe(juniorUserId);

    const resMiddle = await request(app)
      .get(`/api/tasks/${taskId}/feedback`)
      .set("Cookie", `accessToken=${middleToken}`);
    expect(resMiddle.status).toBe(200);

    const resSenior = await request(app)
      .get(`/api/tasks/${taskId}/feedback`)
      .set("Cookie", `accessToken=${seniorToken}`);
    expect(resSenior.status).toBe(200);
  });

  it("should not allow junior to delete feedback", async () => {
    // First add feedback
    const addRes = await request(app)
      .post(`/api/tasks/${taskId}/feedback`)
      .send({
        comment: "Test Feedback",
        author: juniorUserId,
      })
      .set("Cookie", `accessToken=${seniorToken}`);
    const feedbackId = addRes.body.taskFeedback.feedback[0]._id;

    // Try to delete with junior
    const res = await request(app)
      .delete(`/api/tasks/${taskId}/feedback/${feedbackId}`)
      .set("Cookie", `accessToken=${juniorToken}`);
    expect(res.status).toBe(403);
  }, 10000);

  it("should not allow middle to delete feedback", async () => {
    // First add feedback
    const addRes = await request(app)
      .post(`/api/tasks/${taskId}/feedback`)
      .send({
        comment: "Test Feedback",
        author: juniorUserId,
      })
      .set("Cookie", `accessToken=${seniorToken}`);
    const feedbackId = addRes.body.taskFeedback.feedback[0]._id;

    // Try to delete with middle
    const res = await request(app)
      .delete(`/api/tasks/${taskId}/feedback/${feedbackId}`)
      .set("Cookie", `accessToken=${middleToken}`);
    expect(res.status).toBe(403);
  }, 10000);

  it("should allow senior to delete feedback", async () => {
    // First add feedback
    const addRes = await request(app)
      .post(`/api/tasks/${taskId}/feedback`)
      .send({
        comment: "Test Feedback",
        author: juniorUserId,
      })
      .set("Cookie", `accessToken=${seniorToken}`);
    const feedbackId = addRes.body.taskFeedback.feedback[0]._id;

    // Delete with senior
    const res = await request(app)
      .delete(`/api/tasks/${taskId}/feedback/${feedbackId}`)
      .set("Cookie", `accessToken=${seniorToken}`);
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Feedback deleted successfully");

    // Verify feedback is gone
    const getRes = await request(app)
      .get(`/api/tasks/${taskId}/feedback`)
      .set("Cookie", `accessToken=${seniorToken}`);
    expect(getRes.body.feedback.length).toBe(0);
  });
});
