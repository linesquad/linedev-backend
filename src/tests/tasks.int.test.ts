import request from "supertest";
import app from "../server";
import mongoose from "mongoose";

import dotenv from "dotenv";
import { createTestAccount } from "./utils/createTestAccount";

dotenv.config();

let accessToken: string;
let refreshToken: string;
let juniorToken: string;
let juniorUserId: string;
let middleToken: string;
let middleUserId: string;
let seniorToken: string;
let seniorUserId: string;
let taskId: string;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_TEST_URL!);
  await mongoose.connection.dropDatabase();

  try {
    const juniorAccount = await createTestAccount("junior");
    juniorToken = juniorAccount.accessToken;
    juniorUserId = juniorAccount.account._id.toString();

    const middleAccount = await createTestAccount("middle");
    middleToken = middleAccount.accessToken;
    middleUserId = middleAccount.account._id.toString();

    const seniorAccount = await createTestAccount("senior");
    seniorToken = seniorAccount.accessToken;
    seniorUserId = seniorAccount.account._id.toString();
  } catch (error) {
    console.error("Error setting up test accounts:", error);
    throw error;
  }
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

describe("Tasks creation", () => {
  it("should be able to create a task as senior", async () => {
    const taskData = {
      title: "Test Task",
      description: "Test Description",
      status: "pending",
      dueDate: new Date().toISOString(),
      assignedTo: juniorUserId,
      priority: "low",
      subtasks: [
        {
          title: "Subtask 1",
          done: false,
        },
      ],
    };

    const response = await request(app)
      .post("/api/tasks")
      .set("Cookie", [`accessToken=${seniorToken}`])
      .send(taskData);

    if (response.status !== 201) {
      console.error("Task creation failed:", response.body);
      throw new Error(`Task creation failed: ${JSON.stringify(response.body)}`);
    }

    taskId = response.body.task._id;
    expect(response.status).toBe(201);
    expect(response.body.message).toBe("Task created successfully");
    expect(response.body.task.title).toBe("Test Task");
    expect(response.body.task.description).toBe("Test Description");
    expect(response.body.task.status).toBe("pending");
    expect(response.body.task.priority).toBe("low");
    expect(response.body.task.assignedTo).toBe(juniorUserId);
    expect(response.body.task.subtasks).toHaveLength(1);
    expect(response.body.task.subtasks[0].title).toBe("Subtask 1");
    expect(response.body.task.subtasks[0].done).toBe(false);
    expect(response.body.task.feedback).toEqual([]);
  });

  it("should not be able to create a task as junior", async () => {
    const response = await request(app)
      .post("/api/tasks")
      .set("Cookie", [`accessToken=${juniorToken}`])
      .send({
        title: "Test Task",
        description: "Test Description",
        status: "pending",
        dueDate: new Date().toISOString(),
        assignedTo: juniorUserId,
        priority: "low",
        subtasks: [
          {
            title: "Subtask 1",
            done: false,
          },
        ],
      });
    expect(response.status).toBe(403);
    expect(response.body.message).toBe(
      "Forbidden: junior is not allowed to access this resource"
    );
  });

  it("should not be able to create a task as middle", async () => {
    const response = await request(app)
      .post("/api/tasks")
      .set("Cookie", [`accessToken=${middleToken}`])
      .send({
        title: "Test Task",
        description: "Test Description",
        status: "pending",
        dueDate: new Date().toISOString(),
        assignedTo: juniorUserId,
        priority: "low",
        subtasks: [
          {
            title: "Subtask 1",
            done: false,
          },
        ],
      });
    expect(response.status).toBe(403);
    expect(response.body.message).toBe(
      "Forbidden: middle is not allowed to access this resource"
    );
  });

  it("should not be able to create a task with invalid data", async () => {
    const response = await request(app)
      .post("/api/tasks")
      .set("Cookie", [`accessToken=${seniorToken}`])
      .send({
        title: "Test Task",
        description: "Test Description",
        status: "pending",
        dueDate: new Date().toISOString(),
        assignedTo: "invalid user id",
      });
    expect(response.status).toBe(400);
  });

  it("should not be able to create a task with invalid due date", async () => {
    const response = await request(app)
      .post("/api/tasks")
      .set("Cookie", [`accessToken=${seniorToken}`])
      .send({
        title: "Test Task",
        description: "Test Description",
        status: "pending",
        dueDate: "invalid date",
        assignedTo: juniorUserId,
        priority: "low",
        subtasks: [
          {
            title: "Subtask 1",
            done: false,
          },
        ],
      });
    expect(response.status).toBe(400);
  });
});

describe("Tasks retrieval", () => {
  it("should be able to get tasks as senior", async () => {
    const response = await request(app)
      .get("/api/tasks")
      .set("Cookie", [`accessToken=${seniorToken}`]);
    expect(response.status).toBe(200);
    expect(response.body.tasks).toHaveLength(1);
    expect(response.body.tasks[0].title).toBe("Test Task");
    expect(response.body.tasks[0].description).toBe("Test Description");
    expect(response.body.tasks[0].status).toBe("pending");
    expect(response.body.tasks[0].priority).toBe("low");
    expect(response.body.tasks[0].isOverdue).toBe(true);
    expect(response.body.tasks[0].assignedTo).toBe(juniorUserId);
  });
  it("should be able to get tasks as junior", async () => {
    const response = await request(app)
      .get("/api/tasks")
      .set("Cookie", [`accessToken=${juniorToken}`]);
    expect(response.status).toBe(200);
    expect(response.body.tasks).toHaveLength(1);
    expect(response.body.tasks[0].title).toBe("Test Task");
    expect(response.body.tasks[0].description).toBe("Test Description");
    expect(response.body.tasks[0].status).toBe("pending");
    expect(response.body.tasks[0].priority).toBe("low");
    expect(response.body.tasks[0].isOverdue).toBe(true);
    expect(response.body.tasks[0].assignedTo).toBe(juniorUserId);
  });

  it("should be able to get tasks as middle", async () => {
    const response = await request(app)
      .get("/api/tasks")
      .set("Cookie", [`accessToken=${middleToken}`]);
    expect(response.status).toBe(200);
    expect(response.body.tasks).toHaveLength(1);
    expect(response.body.tasks[0].title).toBe("Test Task");
    expect(response.body.tasks[0].description).toBe("Test Description");
    expect(response.body.tasks[0].status).toBe("pending");
    expect(response.body.tasks[0].priority).toBe("low");
    expect(response.body.tasks[0].isOverdue).toBe(true);
    expect(response.body.tasks[0].assignedTo).toBe(juniorUserId);
  });
});

describe("Tasks retrieval by id", () => {
  it("should be able to get task by id as senior", async () => {
    const response = await request(app)
      .get(`/api/tasks/${taskId}`)
      .set("Cookie", [`accessToken=${seniorToken}`]);
    expect(response.status).toBe(200);
    expect(response.body.task.title).toBe("Test Task");
    expect(response.body.task.description).toBe("Test Description");
    expect(response.body.task.status).toBe("pending");
    expect(response.body.task.priority).toBe("low");
    expect(response.body.task.assignedTo).toBe(juniorUserId);
    expect(response.body.task.subtasks).toHaveLength(1);
    expect(response.body.task.subtasks[0].title).toBe("Subtask 1");
    expect(response.body.task.subtasks[0].done).toBe(false);
    expect(response.body.task.feedback).toEqual([]);
    expect(response.body.task.isOverdue).toBe(true);
  });

  it("should be able to get task by id as junior", async () => {
    const response = await request(app)
      .get(`/api/tasks/${taskId}`)
      .set("Cookie", [`accessToken=${juniorToken}`]);
    expect(response.status).toBe(200);
    expect(response.body.task.title).toBe("Test Task");
    expect(response.body.task.description).toBe("Test Description");
    expect(response.body.task.status).toBe("pending");
    expect(response.body.task.priority).toBe("low");
    expect(response.body.task.assignedTo).toBe(juniorUserId);
    expect(response.body.task.subtasks).toHaveLength(1);
    expect(response.body.task.subtasks[0].title).toBe("Subtask 1");
    expect(response.body.task.subtasks[0].done).toBe(false);
    expect(response.body.task.feedback).toEqual([]);
    expect(response.body.task.isOverdue).toBe(true);
  });

  it("should be able to get task by id as middle", async () => {
    const response = await request(app)
      .get(`/api/tasks/${taskId}`)
      .set("Cookie", [`accessToken=${middleToken}`]);
    expect(response.status).toBe(200);
    expect(response.body.task.title).toBe("Test Task");
    expect(response.body.task.description).toBe("Test Description");
    expect(response.body.task.status).toBe("pending");
    expect(response.body.task.priority).toBe("low");
    expect(response.body.task.assignedTo).toBe(juniorUserId);
    expect(response.body.task.subtasks).toHaveLength(1);
    expect(response.body.task.subtasks[0].title).toBe("Subtask 1");
    expect(response.body.task.subtasks[0].done).toBe(false);
    expect(response.body.task.feedback).toEqual([]);
    expect(response.body.task.isOverdue).toBe(true);
  });

  it("should not be able to get task by id as unauthorized", async () => {
    const response = await request(app).get(`/api/tasks/${taskId}`);
    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Unauthorized");
  });

  it("should not be able to get task by id as invalid id", async () => {
    const response = await request(app)
      .get(`/api/tasks/666666666666666666666666`)
      .set("Cookie", [`accessToken=${seniorToken}`]);
    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Task not found");
  });
});

describe("Tasks Update", () => {
  it("should be able to update a task as senior", async () => {
    const response = await request(app)
      .put(`/api/tasks/${taskId}`)
      .set("Cookie", [`accessToken=${seniorToken}`])
      .send({
        title: "Updated Task",
        description: "Updated Description",
        status: "in progress",
        dueDate: new Date().toISOString(),
        assignedTo: juniorUserId,
        priority: "medium",
        subtasks: [
          {
            title: "Updated Subtask 1",
            done: true,
          },
        ],
      });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Task updated successfully");
    expect(response.body.task.title).toBe("Updated Task");
    expect(response.body.task.description).toBe("Updated Description");
    expect(response.body.task.status).toBe("in progress");
    expect(response.body.task.priority).toBe("medium");
    expect(response.body.task.assignedTo).toBe(juniorUserId);
    expect(response.body.task.subtasks).toHaveLength(1);
  });

  it("should not be able to update a task as junior", async () => {
    const response = await request(app)
      .put(`/api/tasks/${taskId}`)
      .set("Cookie", [`accessToken=${juniorToken}`])
      .send({
        title: "Updated Task",
      });
    expect(response.status).toBe(403);
    expect(response.body.message).toBe(
      "Forbidden: junior is not allowed to access this resource"
    );
  });
  it("should not be able to update a task as middle", async () => {
    const response = await request(app)
      .put(`/api/tasks/${taskId}`)
      .set("Cookie", [`accessToken=${middleToken}`])
      .send({
        title: "Updated Task",
      });
    expect(response.status).toBe(403);
    expect(response.body.message).toBe(
      "Forbidden: middle is not allowed to access this resource"
    );
  });
  it("should not be able to update a task with invalid data", async () => {
    const response = await request(app)
      .put(`/api/tasks/${taskId}`)
      .set("Cookie", [`accessToken=${seniorToken}`])
      .send({
        title: "Updated Task",
        description: "Updated Description",
        status: "in progress",
        dueDate: "invalid date",
        assignedTo: juniorUserId,
        priority: "medium",
        subtasks: [
          {
            title: "Updated Subtask 1",
            done: true,
          },
        ],
      });
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Error updating task");
  });
});

describe("Tasks Delete", () => {
  it("should be able to delete a task as senior", async () => {
    const response = await request(app)
      .delete(`/api/tasks/${taskId}`)
      .set("Cookie", [`accessToken=${seniorToken}`]);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Task deleted successfully");
  });

  it("should not be able to delete a task as junior", async () => {
    const response = await request(app)
      .delete(`/api/tasks/${taskId}`)
      .set("Cookie", [`accessToken=${juniorToken}`]);
    console.log(response.status, juniorToken);
    expect(response.status).toBe(403);
    expect(response.body.message).toBe(
      "Forbidden: junior is not allowed to access this resource"
    );
  });

  it("should not be able to delete a task as middle", async () => {
    const response = await request(app)
      .delete(`/api/tasks/${taskId}`)
      .set("Cookie", [`accessToken=${middleToken}`]);
    console.log(response.status, middleToken);
    expect(response.status).toBe(403);
    expect(response.body.message).toBe(
      "Forbidden: middle is not allowed to access this resource"
    );
  });
});
