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

afterEach(async () => {
  await mongoose.connection.collection("tasks").deleteMany({});
});

describe("Tasks API Error Cases", () => {
  it("should fail to create task with invalid data", async () => {
    const response = await request(app)
      .post("/api/tasks")
      .set("Cookie", `accessToken=${seniorToken}`)
      .send({
        // Missing required fields
      });

    expect(response.status).toBe(400);
    // Expect the validation error array format
    expect(Array.isArray(JSON.parse(response.body.message))).toBe(true);
    expect(response.body.errors).toBeDefined();
    expect(response.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ path: "title" }),
        expect.objectContaining({ path: "description" }),
        expect.objectContaining({ path: "status" }),
        expect.objectContaining({ path: "dueDate" }),
        expect.objectContaining({ path: "assignedTo" }),
        expect.objectContaining({ path: "subtasks" }),
      ])
    );
  });

  it("should fail to get non-existent task", async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const response = await request(app)
      .get(`/api/tasks/${fakeId}`)
      .set("Cookie", `accessToken=${juniorToken}`);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Task not found");
  });

  it("should fail to update non-existent task", async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const response = await request(app)
      .put(`/api/tasks/${fakeId}`)
      .set("Cookie", `accessToken=${seniorToken}`)
      .send({
        title: "Updated Task",
        description: "Updated Description",
      });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Task not found");
  });

  it("should fail to toggle non-existent subtask", async () => {
    // First create a real task
    const createResponse = await request(app)
      .post("/api/tasks")
      .set("Cookie", `accessToken=${seniorToken}`)
      .send({
        title: "Test Task",
        description: "Test Description",
        status: "pending",
        priority: "high",
        dueDate: new Date().toISOString(),
        assignedTo: juniorUserId,
        subtasks: [],
      });

    const taskId = createResponse.body.task._id;
    const fakeSubtaskId = new mongoose.Types.ObjectId();

    const response = await request(app)
      .patch(`/api/tasks/${taskId}/subtasks/${fakeSubtaskId}`)
      .set("Cookie", `accessToken=${seniorToken}`);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Subtask not found");
  });

  it("should fail to delete non-existent task", async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const response = await request(app)
      .delete(`/api/tasks/${fakeId}`)
      .set("Cookie", `accessToken=${seniorToken}`);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Task not found");
  });
});

describe("Tasks API Validation Cases", () => {
  it("should fail to create task with invalid date format", async () => {
    const response = await request(app)
      .post("/api/tasks")
      .set("Cookie", `accessToken=${seniorToken}`)
      .send({
        title: "Test Task",
        description: "Test Description",
        status: "pending",
        dueDate: "invalid-date",
        subtasks: [],
      });

    expect(response.status).toBe(400);
  });

  it("should fail to create task with invalid status", async () => {
    const response = await request(app)
      .post("/api/tasks")
      .set("Cookie", `accessToken=${seniorToken}`)
      .send({
        title: "Test Task",
        description: "Test Description",
        status: "invalid-status",
        dueDate: new Date().toISOString(),
        subtasks: [],
      });

    expect(response.status).toBe(400);
  });
});

describe("Tasks API Edge Cases", () => {
  it("should handle creating task with empty subtasks array", async () => {
    const response = await request(app)
      .post("/api/tasks")
      .set("Cookie", `accessToken=${seniorToken}`)
      .send({
        title: "Test Task",
        description: "Test Description",
        status: "pending",
        priority: "high",
        dueDate: new Date().toISOString(),
        assignedTo: juniorUserId,
        subtasks: [],
      });

    expect(response.status).toBe(201);
    expect(response.body.task.subtasks).toHaveLength(0);
  });

  it("should handle updating task with empty subtasks array", async () => {
    // First create a task with subtasks
    const createResponse = await request(app)
      .post("/api/tasks")
      .set("Cookie", `accessToken=${seniorToken}`)
      .send({
        title: "Test Task",
        description: "Test Description",
        status: "pending",
        priority: "high",
        dueDate: new Date().toISOString(),
        assignedTo: juniorUserId,
        subtasks: [{ title: "Subtask 1", done: false }],
      });

    const taskId = createResponse.body.task._id;

    // Then update it with empty subtasks
    const response = await request(app)
      .put(`/api/tasks/${taskId}`)
      .set("Cookie", `accessToken=${seniorToken}`)
      .send({
        title: "Test Task",
        description: "Test Description",
        status: "pending",
        priority: "high",
        dueDate: new Date().toISOString(),
        assignedTo: juniorUserId,
        subtasks: [],
      });

    expect(response.status).toBe(200);
    expect(response.body.task.subtasks).toHaveLength(0);
  });
});

describe("Tasks API Success Cases", () => {
  let taskId: string;
  let subtaskId: string;

  beforeEach(async () => {
    // Create a fresh task before each test
    const createResponse = await request(app)
      .post("/api/tasks")
      .set("Cookie", `accessToken=${seniorToken}`)
      .send({
        title: "Test Task",
        description: "Test Description",
        status: "pending",
        priority: "high",
        dueDate: new Date().toISOString(),
        assignedTo: juniorUserId,
        subtasks: [{ title: "Subtask 1", done: false }],
      });

    taskId = createResponse.body.task._id;
    subtaskId = createResponse.body.task.subtasks[0]._id;
  });

  it("should create a task successfully", async () => {
    const response = await request(app)
      .post("/api/tasks")
      .set("Cookie", `accessToken=${seniorToken}`)
      .send({
        title: "Test Task",
        description: "Test Description",
        status: "pending",
        priority: "high",
        dueDate: new Date().toISOString(),
        assignedTo: juniorUserId.toString(),
        subtasks: [{ title: "Subtask 1", done: false }],
      });

    expect(response.status).toBe(201);
    expect(response.body.task).toBeDefined();
    expect(response.body.task.title).toBe("Test Task");
    taskId = response.body.task._id;
    subtaskId = response.body.task.subtasks[0]._id;
  });

  it("should get all tasks successfully", async () => {
    const response = await request(app)
      .get("/api/tasks")
      .set("Cookie", `accessToken=${seniorToken}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.tasks)).toBe(true);
  });

  it("should get task by id successfully", async () => {
    const response = await request(app)
      .get(`/api/tasks/${taskId}`)
      .set("Cookie", `accessToken=${seniorToken}`);

    expect(response.status).toBe(200);
    expect(response.body.task._id).toBe(taskId);
  });

  it("should update task successfully", async () => {
    const response = await request(app)
      .put(`/api/tasks/${taskId}`)
      .set("Cookie", `accessToken=${seniorToken}`)
      .send({
        title: "Updated Title",
        description: "Updated Description",
      });

    expect(response.status).toBe(200);
    expect(response.body.task.title).toBe("Updated Title");
  });

  it("should toggle subtask successfully", async () => {
    const response = await request(app)
      .patch(`/api/tasks/${taskId}/subtasks/${subtaskId}`)
      .set("Cookie", `accessToken=${seniorToken}`);

    expect(response.status).toBe(200);
    expect(response.body.task.subtasks[0].done).toBe(true);
  });
});

describe("Tasks API Authorization Cases", () => {
  let taskId: string;

  beforeEach(async () => {
    const response = await request(app)
      .post("/api/tasks")
      .set("Cookie", `accessToken=${seniorToken}`)
      .send({
        title: "Auth Test Task",
        description: "Test Description",
        status: "pending",
        priority: "high",
        dueDate: new Date().toISOString(),
        assignedTo: juniorUserId,
        subtasks: [],
      });

    expect(response.status).toBe(201);
    taskId = response.body.task._id;
  });

  it("should allow junior to view tasks", async () => {
    const response = await request(app)
      .get("/api/tasks")
      .set("Cookie", `accessToken=${juniorToken}`);

    expect(response.status).toBe(200);
  });

  it("should allow middle to view tasks", async () => {
    const response = await request(app)
      .get("/api/tasks")
      .set("Cookie", `accessToken=${middleToken}`);

    expect(response.status).toBe(200);
  });

});

describe("Tasks API Data Validation", () => {
  it("should validate required fields", async () => {
    const response = await request(app)
      .post("/api/tasks")
      .set("Cookie", `accessToken=${seniorToken}`)
      .send({
        // Missing title and other required fields
        description: "Test Description",
      });

    expect(response.status).toBe(400);
  });

  it("should validate priority values", async () => {
    const response = await request(app)
      .post("/api/tasks")
      .set("Cookie", `accessToken=${seniorToken}`)
      .send({
        title: "Test Task",
        description: "Test Description",
        status: "pending",
        priority: "invalid-priority", // Invalid priority
        dueDate: new Date().toISOString(),
      });

    expect(response.status).toBe(400);
  });
});
