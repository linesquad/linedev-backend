import request from "supertest";
import app from "../server";
import mongoose from "mongoose";
import { createTestAccount } from "./utils/createTestAccount";

let juniorToken: string;
let middleToken: string;
let seniorToken: string;
let seniorUserId: string;
let juniorUserId: string;
let middleUserId: string;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URL!);

  const juniorAccount = await createTestAccount("junior");
  juniorToken = juniorAccount.accessToken;
  juniorUserId = juniorAccount.account._id.toString();

  const middleAccount = await createTestAccount("middle");
  middleToken = middleAccount.accessToken;
  middleUserId = middleAccount.account._id.toString();

  const seniorAccount = await createTestAccount("senior");
  seniorToken = seniorAccount.accessToken;
  seniorUserId = seniorAccount.account._id.toString();
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

describe("Tasks API", () => {
  let taskId: string;

  it("should create a task", async () => {
    const response = await request(app)
      .post("/api/tasks")
      .set("Cookie", `accessToken=${seniorToken}`)
      .send({
        title: "Test Task",
        description: "Test Description",
        status: "pending",
        assignedTo: juniorUserId,
        dueDate: new Date(Date.now() - 86400000).toISOString(),
        priority: "low",
      });

    expect(response.status).toBe(201);
    expect(response.body.task).toBeDefined();
    taskId = response.body.task._id;
  });

  it("should get all tasks", async () => {
    const response = await request(app)
      .get("/api/tasks")
      .set("Cookie", `accessToken=${juniorToken}`);

    expect(response.status).toBe(200);
    expect(response.body.tasks).toBeDefined();
    expect(Array.isArray(response.body.tasks)).toBe(true);

    const task = response.body.tasks.find((t: any) => t._id === taskId);
    expect(task).toBeDefined();
    expect(task.isOverdue).toBe(true);
  });

  it("should get my tasks", async () => {
    const response = await request(app)
      .get("/api/tasks/mine")
      .set("Cookie", `accessToken=${juniorToken}`);

    expect(response.status).toBe(200);
    expect(response.body.tasks).toBeDefined();
    expect(Array.isArray(response.body.tasks)).toBe(true);

    response.body.tasks.forEach((task: any) => {
      expect(task.assignedTo).toBe(juniorUserId);
    });

    const task = response.body.tasks.find((t: any) => t._id === taskId);
    expect(task).toBeDefined();
    expect(task.isOverdue).toBe(true);
  });

  it("should get a task by id", async () => {
    const response = await request(app)
      .get(`/api/tasks/${taskId}`)
      .set("Cookie", `accessToken=${juniorToken}`);

    expect(response.status).toBe(200);
    expect(response.body.task).toBeDefined();
    expect(response.body.task.isOverdue).toBe(true);
  });

  it("should update a task", async () => {
    const response = await request(app)
      .put(`/api/tasks/${taskId}`)
      .set("Cookie", `accessToken=${seniorToken}`)
      .send({
        status: "done",
      });

    expect(response.status).toBe(200);
    expect(response.body.task).toBeDefined();
    expect(response.body.task.isOverdue).toBe(false);
  });

  it("should fail to update a task", async () => {
    const response = await request(app)
      .put(`/api/tasks/${taskId}`)
      .set("Cookie", `accessToken=${juniorToken}`)
      .send({
        status: "done",
      });

    expect(response.status).toBe(403);
    expect(response.body.message).toBe(
      "Forbidden: junior is not allowed to access this resource"
    );
  });

  it("should delete a task", async () => {
    const response = await request(app)
      .delete(`/api/tasks/${taskId}`)
      .set("Cookie", `accessToken=${seniorToken}`);

    expect(response.status).toBe(200);
    expect(response.body.task).toBeDefined();
  });
});
