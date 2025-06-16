// import request from "supertest";
// import app from "../server";
// import mongoose from "mongoose";

// import dotenv from "dotenv";
// import { createTestAccount } from "./utils/createTestAccount";

// dotenv.config();


// let accessToken: string;
// let refreshToken: string;
// let juniorToken: string;
// let juniorUserId: string;
// let middleToken: string;
// let middleUserId: string;
// let seniorToken: string;
// let seniorUserId: string;
// let taskId: string;

// beforeAll(async () => {
//   try {
//     await mongoose.connect(process.env.MONGO_TEST_URL!);
//     await mongoose.connection.dropDatabase();

//     const juniorAccount = await createTestAccount("junior");
//     juniorToken = juniorAccount.accessToken;
//     juniorUserId = juniorAccount.account._id.toString();

//     const middleAccount = await createTestAccount("middle");
//     middleToken = middleAccount.accessToken;
//     middleUserId = middleAccount.account._id.toString();

//     const seniorAccount = await createTestAccount("senior");
//     seniorToken = seniorAccount.accessToken;
//     seniorUserId = seniorAccount.account._id.toString();
//   } catch (error) {
//     console.error("Error setting up test accounts:", error);
//     throw error;
//   }
// });

// afterAll(async () => {
//   try {
//     await mongoose.connection.dropDatabase();
//     await mongoose.connection.close();
//   } catch (error) {
//     console.error("Error cleaning up:", error);
//     throw error;
//   }
// });

// describe("Feedback Tests", () => {
//   beforeEach(async () => {
//     try {
//       // Create a task before each feedback test
//       const taskData = {
//         title: "Test Task",
//         description: "Test Description",
//         status: "pending",
//         dueDate: new Date().toISOString(),
//         assignedTo: juniorUserId,
//         priority: "low",
//         subtasks: [
//           {
//             title: "Subtask 1",
//             done: false,
//           },
//         ],
//       };

//       const response = await request(app)
//         .post("/api/tasks")
//         .set("Cookie", [`accessToken=${seniorToken}`])
//         .send(taskData);

//       if (response.status !== 201) {
//         console.error("Task creation failed:", response.body);
//         throw new Error(
//           `Task creation failed: ${JSON.stringify(response.body)}`
//         );
//       }

//       taskId = response.body.task._id;

//       // Create feedback for the task
//       await request(app)
//         .post(`/api/tasks/${taskId}/feedback`)
//         .set("Cookie", [`accessToken=${seniorToken}`])
//         .send({
//           author: seniorUserId,
//           comment: "Test Feedback",
//         });
//     } catch (error) {
//       console.error("Error in beforeEach:", error);
//       throw error;
//     }
//   });

//   describe("Feedback creation", () => {
//     it("should be able to create a feedback as senior", async () => {
//       const response = await request(app)
//         .post(`/api/tasks/${taskId}/feedback`)
//         .set("Cookie", [`accessToken=${seniorToken}`])
//         .send({
//           author: seniorUserId,
//           comment: "Test Feedback",
//         });
//       expect(response.status).toBe(200);
//       expect(response.body.message).toBe("Feedback added successfully");
//       expect(response.body.taskFeedback).toBeDefined();
//       expect(response.body.taskFeedback.feedback).toHaveLength(2);
//       expect(response.body.taskFeedback.feedback[1].comment).toBe(
//         "Test Feedback"
//       );
//       expect(response.body.taskFeedback.feedback[1].author).toBe(seniorUserId);
//     });

//     it("should not be able to create feedback with invalid data", async () => {
//       const response = await request(app)
//         .post(`/api/tasks/${taskId}/feedback`)
//         .set("Cookie", [`accessToken=${seniorToken}`])
//         .send({
//           author: "",
//           comment: "",
//         });
//       expect(response.status).toBe(400);
//       expect(response.body.errors).toBeDefined();
//       expect(response.body.errors).toHaveLength(2);
//       expect(response.body.errors[0].path).toContain("comment");
//       expect(response.body.errors[1].path).toContain("author");
//     });

//     it("should not be able to create feedback for non-existent task", async () => {
//       const response = await request(app)
//         .post(`/api/tasks/666666666666666666666666/feedback`)
//         .set("Cookie", [`accessToken=${seniorToken}`])
//         .send({
//           author: seniorUserId,
//           comment: "Test Feedback",
//         });
//       expect(response.status).toBe(404);
//       expect(response.body.message).toBe("Task not found");
//     });

//     it("should not be able to create feedback as unauthorized user", async () => {
//       const response = await request(app)
//         .post(`/api/tasks/${taskId}/feedback`)
//         .send({
//           author: seniorUserId,
//           comment: "Test Feedback",
//         });
//       expect(response.status).toBe(401);
//       expect(response.body.message).toBe("Unauthorized");
//     });
//   });

//   describe("Feedback retrieval", () => {
//     it("should be able to get feedback as senior", async () => {
//       const response = await request(app)
//         .get(`/api/tasks/${taskId}/feedback`)
//         .set("Cookie", [`accessToken=${seniorToken}`]);

//       expect(response.status).toBe(200);
//       expect(response.body.message).toBe("Feedback fetched successfully");
//       expect(response.body.feedback).toBeDefined();
//       expect(response.body.feedback).toHaveLength(1);
//       expect(response.body.feedback[0].comment).toBe("Test Feedback");
//       expect(response.body.feedback[0].author).toBe(seniorUserId);
//     });

//     it("should be able to get feedback as junior", async () => {
//       const response = await request(app)
//         .get(`/api/tasks/${taskId}/feedback`)
//         .set("Cookie", [`accessToken=${juniorToken}`]);
//       expect(response.status).toBe(200);
//       expect(response.body.message).toBe("Feedback fetched successfully");
//       expect(response.body.feedback).toBeDefined();
//       expect(response.body.feedback).toHaveLength(1);
//       expect(response.body.feedback[0].comment).toBe("Test Feedback");
//       expect(response.body.feedback[0].author).toBe(seniorUserId);
//     });

//     it("should be able to get feedback as middle", async () => {
//       const response = await request(app)
//         .get(`/api/tasks/${taskId}/feedback`)
//         .set("Cookie", [`accessToken=${middleToken}`]);
//       expect(response.status).toBe(200);
//       expect(response.body.message).toBe("Feedback fetched successfully");
//       expect(response.body.feedback).toBeDefined();
//       expect(response.body.feedback).toHaveLength(1);
//       expect(response.body.feedback[0].comment).toBe("Test Feedback");
//       expect(response.body.feedback[0].author).toBe(seniorUserId);
//     });

//     it("should not be able to get feedback as unauthorized user", async () => {
//       const response = await request(app)
//         .get(`/api/tasks/${taskId}/feedback`)
//         .send({});
//       expect(response.status).toBe(401);
//     });
//   });

//   describe("Feedback deletion", () => {
//     it("should be able to delete feedback as senior", async () => {
//       // First get the feedback to get its ID
//       const getResponse = await request(app)
//         .get(`/api/tasks/${taskId}/feedback`)
//         .set("Cookie", [`accessToken=${seniorToken}`]);

//       const feedbackId = getResponse.body.feedback[0]._id;

//       const response = await request(app)
//         .delete(`/api/tasks/${taskId}/feedback/${feedbackId}`)
//         .set("Cookie", [`accessToken=${seniorToken}`]);
//       expect(response.status).toBe(200);
//       expect(response.body.message).toBe("Feedback deleted successfully");
//     });

//     it("should not be able to delete feedback as unauthorized user", async () => {
//       // First get the feedback to get its ID
//       const getResponse = await request(app)
//         .get(`/api/tasks/${taskId}/feedback`)
//         .set("Cookie", [`accessToken=${seniorToken}`]);

//       const feedbackId = getResponse.body.feedback[0]._id;

//       const response = await request(app)
//         .delete(`/api/tasks/${taskId}/feedback/${feedbackId}`)
//         .send({});
//       expect(response.status).toBe(401);
//       expect(response.body.message).toBe("Unauthorized");
//     });

//     it("should not be able to delete feedback as junior", async () => {
//       // First get the feedback to get its ID
//       const getResponse = await request(app)
//         .get(`/api/tasks/${taskId}/feedback`)
//         .set("Cookie", [`accessToken=${seniorToken}`]);

//       const feedbackId = getResponse.body.feedback[0]._id;

//       const response = await request(app)
//         .delete(`/api/tasks/${taskId}/feedback/${feedbackId}`)
//         .set("Cookie", [`accessToken=${juniorToken}`]);
//       expect(response.status).toBe(403);
//       expect(response.body.message).toBe(
//         "Forbidden: junior is not allowed to access this resource"
//       );
//     });

//     it("should not be able to delete feedback as middle", async () => {
//       // First get the feedback to get its ID
//       const getResponse = await request(app)
//         .get(`/api/tasks/${taskId}/feedback`)
//         .set("Cookie", [`accessToken=${seniorToken}`]);

//       const feedbackId = getResponse.body.feedback[0]._id;

//       const response = await request(app)
//         .delete(`/api/tasks/${taskId}/feedback/${feedbackId}`)
//         .set("Cookie", [`accessToken=${middleToken}`]);
//       expect(response.status).toBe(403);
//       expect(response.body.message).toBe(
//         "Forbidden: middle is not allowed to access this resource"
//       );
//     });
//   });
// });
