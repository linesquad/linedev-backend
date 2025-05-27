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
        assignedTo: juniorUserId.toString(),
        dueDate: new Date().toISOString(),
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
  });

  it("should get a task by id", async () => {
    const response = await request(app)
      .get(`/api/tasks/${taskId}`)
      .set("Cookie", `accessToken=${juniorToken}`);

    expect(response.status).toBe(200);
    expect(response.body.task).toBeDefined();
  });

  it("should update a task by id", async () => {
    const response = await request(app)
      .put(`/api/tasks/${taskId}`)
      .set("Cookie", `accessToken=${seniorToken}`)
      .send({
        title: "Updated Task",
        description: "Updated Description",
        dueDate: new Date().toISOString(),
        assignedTo: juniorUserId.toString(),
      });

    expect(response.status).toBe(200);
    expect(response.body.updatedTask).toBeDefined();
    expect(response.body.updatedTask.title).toBe("Updated Task");
  });

  it("should delete a task by id", async () => {
    const response = await request(app)
      .delete(`/api/tasks/${taskId}`)
      .set("Cookie", `accessToken=${seniorToken}`);

    expect(response.status).toBe(200);
    expect(response.body.deletedTask).toBeDefined();
  });
});
