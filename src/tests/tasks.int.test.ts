import request from "supertest";
import app from "../server";
import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import Auth from "../models/Auth";
import Task from "../models/Tasks";

dotenv.config();

let accessToken: string;
let userId: string;
let createdTaskId: string;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_TEST_URL!);

  const hashedPassword = await bcrypt.hash("password", 10);
  const user = await Auth.create({
    name: "Task Tester",
    email: "task.tester@example.com",
    password: hashedPassword,
    role: "senior",
  });

  userId = user._id.toString();

  const loginRes = await request(app).post("/api/auth/login").send({
    email: "task.tester@example.com",
    password: "password",
  });

  const rawCookies = loginRes.headers["set-cookie"];
  const cookies = Array.isArray(rawCookies) ? rawCookies : [rawCookies];

  accessToken = cookies
    .find((c) => c?.startsWith("accessToken"))
    ?.split(";")[0]
    .split("=")[1]!;

  if (!accessToken) throw new Error("Access token not found in login response");
});

afterAll(async () => {
  await Task.deleteMany({ title: /Test Task/i });
  await Auth.deleteOne({ email: "task.tester@example.com" });
  await mongoose.connection.close();
});

describe("Task API", () => {
  it("should create a new task", async () => {
    const res = await request(app)
      .post("/api/tasks")
      .set("Cookie", [`accessToken=${accessToken}`])
      .send({
        title: "Test Task",
        description: "This is a test task",
        status: "pending", // სწორი მნიშვნელობა ზოდ-ს enum-იდან
        priority: "medium", // enum-ის string მნიშვნელობა
        dueDate: new Date(Date.now() + 86400000).toISOString(), // Date უნდა იყოს string ფორმატში (ISO string)
        assignedTo: userId,
        subtasks: [], // სქემა მოითხოვს subtasks-ს, ამიტომ უნდა იყოს მინიმუმ ცარიელი მასივი
      });

    expect(res.status).toBe(201);
    expect(res.body.message).toBe("Task created successfully");
    expect(res.body.task).toHaveProperty("_id");
    createdTaskId = res.body.task._id;
  });

  it("should fetch all tasks", async () => {
    const res = await request(app)
      .get("/api/tasks")
      .set("Cookie", [`accessToken=${accessToken}`]);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Tasks fetched successfully");
    expect(Array.isArray(res.body.tasks)).toBe(true);
  });

  it("should fetch my tasks", async () => {
    const res = await request(app)
      .get("/api/tasks/mine")
      .set("Cookie", [`accessToken=${accessToken}`]);

    console.log("MY TASKS RESPONSE:", res.status, res.body);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Your tasks fetched successfully");
    expect(Array.isArray(res.body.tasks)).toBe(true);
    expect(res.body.tasks[0]).toHaveProperty("isOverdue");
  });

  it("should fetch a task by ID", async () => {
    const res = await request(app)
      .get(`/api/tasks/${createdTaskId}`)
      .set("Cookie", [`accessToken=${accessToken}`]);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Task fetched successfully");
    expect(res.body.task).toHaveProperty("_id", createdTaskId);
  });

  it("should update a task", async () => {
    const res = await request(app)
      .put(`/api/tasks/${createdTaskId}`)
      .set("Cookie", [`accessToken=${accessToken}`])
      .send({
        title: "Updated Test Task",
        description: "Updated description",
        status: "in progress",
        dueDate: new Date(Date.now() + 86400000).toISOString(),
        priority: "medium",
        assignedTo: userId,
        subtasks: [],
      });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Task updated successfully");
    expect(res.body.task.title).toBe("Updated Test Task");
  });

  it("should delete a task", async () => {
    const res = await request(app)
      .delete(`/api/tasks/${createdTaskId}`)
      .set("Cookie", [`accessToken=${accessToken}`]);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Task deleted successfully");
    expect(res.body.task._id).toBe(createdTaskId);
  });
});
