import request from "supertest";
import app from "../server";
import mongoose from "mongoose";
import { createTestAccount } from "./utils/createTestAccount";

interface Subtask {
  title: string;
  done: boolean;
}

interface MockTask {
  title: string;
  description: string;
  status: string;
  dueDate: string;
  assignedTo: string;
  subtasks: Subtask[];
  priority: string;
}

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

describe("Tasks API", () => {
  const createMockTask = (): MockTask => ({
    title: "Test Task",
    description: "Test Description",
    status: "pending",
    dueDate: new Date().toISOString(),
    assignedTo: seniorUserId,
    subtasks: [{ title: "Subtask 1", done: false }],
    priority: "low",
  });

  describe("POST /api/tasks", () => {
    it("should create task as senior", async () => {
      const mockTask = createMockTask();



      const response = await request(app)
        .post("/api/tasks")
        .set("Cookie", `accessToken=${seniorToken}`)
        .send(mockTask);

    

      expect(response.status).toBe(201);
      expect(response.body.task.title).toBe(mockTask.title);
      expect(response.body.task.assignedTo.toString()).toBe(seniorUserId);
    });

    it("should reject task creation as junior", async () => {
      const mockTask = createMockTask();

      const response = await request(app)
        .post("/api/tasks")
        .set("Cookie", `accessToken=${juniorToken}`)
        .send(mockTask);

      expect(response.status).toBe(403);
    });

    describe("validation", () => {
      let mockTask: MockTask;

      beforeEach(() => {
        mockTask = createMockTask();
      });

      it("should reject empty title", async () => {
        const response = await request(app)
          .post("/api/tasks")
          .set("Cookie", `accessToken=${seniorToken}`)
          .send({ ...mockTask, title: "" });

        expect(response.status).toBe(400);
      });

      it("should reject empty description", async () => {
        const response = await request(app)
          .post("/api/tasks")
          .set("Cookie", `accessToken=${seniorToken}`)
          .send({ ...mockTask, description: "" });

        expect(response.status).toBe(400);
      });

      it("should reject invalid status", async () => {
        const response = await request(app)
          .post("/api/tasks")
          .set("Cookie", `accessToken=${seniorToken}`)
          .send({ ...mockTask, status: "invalid_status" });

        expect(response.status).toBe(400);
      });

      it("should reject invalid date format", async () => {
        const response = await request(app)
          .post("/api/tasks")
          .set("Cookie", `accessToken=${seniorToken}`)
          .send({ ...mockTask, dueDate: "invalid-date" });

        expect(response.status).toBe(400);
      });

      it("should reject empty assignedTo", async () => {
        const response = await request(app)
          .post("/api/tasks")
          .set("Cookie", `accessToken=${seniorToken}`)
          .send({ ...mockTask, assignedTo: "" });

        expect(response.status).toBe(400);
      });

      it("should reject invalid subtask format", async () => {
        const response = await request(app)
          .post("/api/tasks")
          .set("Cookie", `accessToken=${seniorToken}`)
          .send({
            ...mockTask,
            subtasks: [{ title: "", done: "not-a-boolean" }],
          });

        expect(response.status).toBe(400);
      });
    });

    describe("creating with subtasks", () => {
      it("should create task with multiple subtasks", async () => {
        const taskWithSubtasks = {
          ...createMockTask(),
          subtasks: [
            { title: "First Subtask", done: false },
            { title: "Second Subtask", done: true },
            { title: "Third Subtask", done: false },
          ],
        };

        const response = await request(app)
          .post("/api/tasks")
          .set("Cookie", `accessToken=${seniorToken}`)
          .send(taskWithSubtasks);

        expect(response.status).toBe(201);
        expect(response.body.task.subtasks).toHaveLength(3);
        expect(response.body.task.subtasks[1].done).toBe(true);
        expect(
          response.body.task.subtasks.map((st: Subtask) => st.title)
        ).toEqual(["First Subtask", "Second Subtask", "Third Subtask"]);
      });

      it("should create task with no subtasks", async () => {
        const taskWithoutSubtasks = {
          ...createMockTask(),
          subtasks: [],
        };

        const response = await request(app)
          .post("/api/tasks")
          .set("Cookie", `accessToken=${seniorToken}`)
          .send(taskWithoutSubtasks);

        expect(response.status).toBe(201);
        expect(response.body.task.subtasks).toHaveLength(0);
      });

      it("should validate each subtask in creation", async () => {
        const taskWithInvalidSubtask = {
          ...createMockTask(),
          subtasks: [
            { title: "Valid Subtask", done: false },
            { title: "", done: false }, // invalid: empty title
            { title: "Another Valid", done: "not-a-boolean" }, // invalid: wrong done type
          ],
        };

        const response = await request(app)
          .post("/api/tasks")
          .set("Cookie", `accessToken=${seniorToken}`)
          .send(taskWithInvalidSubtask);

        expect(response.status).toBe(400);
      });

      it("should preserve subtask order", async () => {
        const orderedSubtasks = [
          { title: "1. First Task", done: false },
          { title: "2. Second Task", done: false },
          { title: "3. Third Task", done: false },
          { title: "4. Fourth Task", done: false },
        ];

        const taskWithOrderedSubtasks = {
          ...createMockTask(),
          subtasks: orderedSubtasks,
        };

        const response = await request(app)
          .post("/api/tasks")
          .set("Cookie", `accessToken=${seniorToken}`)
          .send(taskWithOrderedSubtasks);

        expect(response.status).toBe(201);
        expect(response.body.task.subtasks).toHaveLength(4);
        expect(
          response.body.task.subtasks.map((st: Subtask) => st.title)
        ).toEqual([
          "1. First Task",
          "2. Second Task",
          "3. Third Task",
          "4. Fourth Task",
        ]);
      });

      it("should handle mixed done states", async () => {
        const mixedSubtasks = [
          { title: "Done Task", done: true },
          { title: "Not Done Task", done: false },
          { title: "Another Done", done: true },
          { title: "Default State" }, // done should default to false
        ];

        const taskWithMixedSubtasks = {
          ...createMockTask(),
          subtasks: mixedSubtasks,
        };

        const response = await request(app)
          .post("/api/tasks")
          .set("Cookie", `accessToken=${seniorToken}`)
          .send(taskWithMixedSubtasks);

        expect(response.status).toBe(201);
        expect(response.body.task.subtasks).toHaveLength(4);
        expect(
          response.body.task.subtasks.map((st: Subtask) => st.done)
        ).toEqual([true, false, true, false]);
      });
    });
  });

  describe("GET /api/tasks", () => {
    it("should get tasks as junior", async () => {
      // Create a test task first
      const mockTask = createMockTask();

      const createResponse = await request(app)
        .post("/api/tasks")
        .set("Cookie", `accessToken=${seniorToken}`)
        .send(mockTask);

      expect(createResponse.status).toBe(201);

      const response = await request(app)
        .get("/api/tasks")
        .set("Cookie", `accessToken=${juniorToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.tasks)).toBe(true);
      expect(response.body.tasks.length).toBeGreaterThan(0);
    });
  });

  describe("GET /api/tasks/:id", () => {
    let taskId: string;

    beforeEach(async () => {
      const mockTask = createMockTask();

      const createResponse = await request(app)
        .post("/api/tasks")
        .set("Cookie", `accessToken=${seniorToken}`)
        .send(mockTask);

      // Make sure we have a task created and get its ID
      expect(createResponse.status).toBe(201);
      expect(createResponse.body.task).toBeDefined();
      taskId = createResponse.body.task._id;
    });

    it("should get specific task as middle", async () => {
      const response = await request(app)
        .get(`/api/tasks/${taskId}`)
        .set("Cookie", `accessToken=${middleToken}`);

      expect(response.status).toBe(200);
      expect(response.body.task._id).toBe(taskId);
    });

    it("should return 404 for non-existent task", async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const response = await request(app)
        .get(`/api/tasks/${fakeId}`)
        .set("Cookie", `accessToken=${middleToken}`);

      expect(response.status).toBe(404);
    });
  });

  describe("PUT /api/tasks/:id", () => {
    let taskId: string;

    beforeEach(async () => {
      const mockTask = createMockTask();

      const createResponse = await request(app)
        .post("/api/tasks")
        .set("Cookie", `accessToken=${seniorToken}`)
        .send(mockTask);

      // Make sure we have a task created and get its ID
      expect(createResponse.status).toBe(201);
      expect(createResponse.body.task).toBeDefined();
      taskId = createResponse.body.task._id;
    });

    it("should update task as senior", async () => {
      const updateData = {
        title: "Updated Title",
        status: "in progress",
      };

      const response = await request(app)
        .put(`/api/tasks/${taskId}`)
        .set("Cookie", `accessToken=${seniorToken}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.task.title).toBe(updateData.title);
      expect(response.body.task.status).toBe(updateData.status);
    });

    it("should reject update as junior", async () => {
      const response = await request(app)
        .put(`/api/tasks/${taskId}`)
        .set("Cookie", `accessToken=${juniorToken}`)
        .send({ title: "Try Update" });

      expect(response.status).toBe(403);
    });

    describe("validation", () => {
      it("should reject invalid status in update", async () => {
        const response = await request(app)
          .put(`/api/tasks/${taskId}`)
          .set("Cookie", `accessToken=${seniorToken}`)
          .send({ status: "invalid_status" });

        expect(response.status).toBe(400);
      });

      it("should reject invalid date format in update", async () => {
        const response = await request(app)
          .put(`/api/tasks/${taskId}`)
          .set("Cookie", `accessToken=${seniorToken}`)
          .send({ dueDate: "invalid-date" });

        expect(response.status).toBe(400);
      });

      it("should allow partial updates", async () => {
        const response = await request(app)
          .put(`/api/tasks/${taskId}`)
          .set("Cookie", `accessToken=${seniorToken}`)
          .send({ title: "Only Title Update" });

        expect(response.status).toBe(200);
        expect(response.body.task.title).toBe("Only Title Update");
      });

      it("should reject invalid subtask format in update", async () => {
        const response = await request(app)
          .put(`/api/tasks/${taskId}`)
          .set("Cookie", `accessToken=${seniorToken}`)
          .send({
            subtasks: [{ title: "", done: "not-a-boolean" }],
          });

        expect(response.status).toBe(400);
      });
    });

    describe("subtask updates", () => {
      it("should add new subtasks", async () => {
        const updateData = {
          subtasks: [
            { title: "Subtask 1", done: false },
            { title: "New Subtask", done: false },
          ],
        };

        const response = await request(app)
          .put(`/api/tasks/${taskId}`)
          .set("Cookie", `accessToken=${seniorToken}`)
          .send(updateData);

        expect(response.status).toBe(200);
        expect(response.body.task.subtasks).toHaveLength(2);
        expect(response.body.task.subtasks[1].title).toBe("New Subtask");
      });

      it("should update existing subtask status", async () => {
        const updateData = {
          subtasks: [{ title: "Subtask 1", done: true }],
        };

        const response = await request(app)
          .put(`/api/tasks/${taskId}`)
          .set("Cookie", `accessToken=${seniorToken}`)
          .send(updateData);

        expect(response.status).toBe(200);
        expect(response.body.task.subtasks[0].done).toBe(true);
      });

      it("should replace all subtasks", async () => {
        const updateData = {
          subtasks: [{ title: "Completely New Subtask", done: false }],
        };

        const response = await request(app)
          .put(`/api/tasks/${taskId}`)
          .set("Cookie", `accessToken=${seniorToken}`)
          .send(updateData);

        expect(response.status).toBe(200);
        expect(response.body.task.subtasks).toHaveLength(1);
        expect(response.body.task.subtasks[0].title).toBe(
          "Completely New Subtask"
        );
      });

      it("should clear all subtasks with empty array", async () => {
        const updateData = {
          subtasks: [],
        };

        const response = await request(app)
          .put(`/api/tasks/${taskId}`)
          .set("Cookie", `accessToken=${seniorToken}`)
          .send(updateData);

        expect(response.status).toBe(200);
        expect(response.body.task.subtasks).toHaveLength(0);
      });

      it("should reject invalid subtask structure", async () => {
        const updateData = {
          subtasks: [{ wrongField: "Should Fail" }],
        };

        const response = await request(app)
          .put(`/api/tasks/${taskId}`)
          .set("Cookie", `accessToken=${seniorToken}`)
          .send(updateData);

        expect(response.status).toBe(400);
      });
    });
  });

  describe("DELETE /api/tasks/:id", () => {
    let taskId: string;

    beforeEach(async () => {
      const mockTask = createMockTask();

      const createResponse = await request(app)
        .post("/api/tasks")
        .set("Cookie", `accessToken=${seniorToken}`)
        .send(mockTask);

      // Make sure we have a task created and get its ID
      expect(createResponse.status).toBe(201);
      expect(createResponse.body.task).toBeDefined();
      taskId = createResponse.body.task._id;
    });

    it("should delete task as senior", async () => {
      const response = await request(app)
        .delete(`/api/tasks/${taskId}`)
        .set("Cookie", `accessToken=${seniorToken}`);

      expect(response.status).toBe(200);

      // Verify deletion
      const checkResponse = await request(app)
        .get(`/api/tasks/${taskId}`)
        .set("Cookie", `accessToken=${seniorToken}`);
      expect(checkResponse.status).toBe(404);
    });

    it("should reject deletion as junior", async () => {
      const response = await request(app)
        .delete(`/api/tasks/${taskId}`)
        .set("Cookie", `accessToken=${juniorToken}`);

      expect(response.status).toBe(403);
    });
  });
});
