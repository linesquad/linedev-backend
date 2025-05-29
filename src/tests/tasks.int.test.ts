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
  let subtaskId: string;

  it("should create a task with subtasks", async () => {
    const response = await request(app)
      .post("/api/tasks")
      .set("Cookie", `accessToken=${seniorToken}`)
      .send({
        title: "Test Task",
        description: "Test Description",
        status: "pending",
        assignedTo: juniorUserId.toString(),
        dueDate: new Date().toISOString(),
        subtasks: [
          { title: "Subtask 1", done: false },
          { title: "Subtask 2", done: false },
        ],
      });

    expect(response.status).toBe(201);
    expect(response.body.task).toBeDefined();
    expect(response.body.task.subtasks).toHaveLength(2);
    expect(response.body.task.subtasks[0].title).toBe("Subtask 1");
    expect(response.body.task.subtasks[0].done).toBe(false);
    taskId = response.body.task._id;
    subtaskId = response.body.task.subtasks[0]._id;
  });

  it("should get all tasks with subtasks", async () => {
    const response = await request(app)
      .get("/api/tasks")
      .set("Cookie", `accessToken=${juniorToken}`);

    expect(response.status).toBe(200);
    expect(response.body.tasks).toBeDefined();
    expect(response.body.tasks[0].subtasks).toBeDefined();
  });

  it("should get a task by id with subtasks", async () => {
    const response = await request(app)
      .get(`/api/tasks/${taskId}`)
      .set("Cookie", `accessToken=${juniorToken}`);

    expect(response.status).toBe(200);
    expect(response.body.task).toBeDefined();
    expect(response.body.task.subtasks).toBeDefined();
  });

  it("should update a task with new subtasks", async () => {
    const response = await request(app)
      .put(`/api/tasks/${taskId}`)
      .set("Cookie", `accessToken=${seniorToken}`)
      .send({
        title: "Updated Task",
        description: "Updated Description",
        dueDate: new Date().toISOString(),
        assignedTo: juniorUserId.toString(),
        subtasks: [
          { title: "New Subtask 1", done: false },
          { title: "New Subtask 2", done: false },
          { title: "New Subtask 3", done: false },
        ],
      });

    expect(response.status).toBe(200);
    expect(response.body.task).toBeDefined();
    expect(response.body.task.title).toBe("Updated Task");
    expect(response.body.task.subtasks).toHaveLength(3);
    // Store a new subtaskId for toggle test
    subtaskId = response.body.task.subtasks[0]._id;
  });

  it("should update a task without changing existing subtasks", async () => {
    const response = await request(app)
      .put(`/api/tasks/${taskId}`)
      .set("Cookie", `accessToken=${seniorToken}`)
      .send({
        title: "Only Update Title",
        description: "Updated Description",
        dueDate: new Date().toISOString(),
        assignedTo: juniorUserId.toString(),
      });

    expect(response.status).toBe(200);
    expect(response.body.task).toBeDefined();
    expect(response.body.task.title).toBe("Only Update Title");
    expect(response.body.task.subtasks).toHaveLength(3);
  });

  it("should toggle subtask status", async () => {
    // First get the current task to verify the subtask exists
    const getResponse = await request(app)
      .get(`/api/tasks/${taskId}`)
      .set("Cookie", `accessToken=${seniorToken}`);

    expect(getResponse.status).toBe(200);
    expect(getResponse.body.task.subtasks).toBeDefined();
    const subtask = getResponse.body.task.subtasks.find(
      (s: any) => s._id === subtaskId
    );
    expect(subtask).toBeDefined();

    const response = await request(app)
      .patch(`/api/tasks/${taskId}/subtasks/${subtaskId}`)
      .set("Cookie", `accessToken=${seniorToken}`);

    expect(response.status).toBe(200);
    expect(response.body.task).toBeDefined();
    expect(
      response.body.task.subtasks.find((s: any) => s._id === subtaskId).done
    ).toBe(!subtask.done);
  });

  it("should delete a task and its subtasks", async () => {
    const response = await request(app)
      .delete(`/api/tasks/${taskId}`)
      .set("Cookie", `accessToken=${seniorToken}`);

    expect(response.status).toBe(200);
    expect(response.body.deletedTask).toBeDefined();
    expect(response.body.deletedTask.subtasks).toHaveLength(0);
  });
});
