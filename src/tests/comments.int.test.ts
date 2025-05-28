import request from "supertest";
import app from "../server";
import mongoose from "mongoose";
import { createTestAccount } from "./utils/createTestAccount";

let seniorToken: string;
let clientToken: string;
let blogId: string = new mongoose.Types.ObjectId().toString(); 

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URL!);

  const seniorAccount = await createTestAccount("senior");
  seniorToken = seniorAccount.accessToken;

  const clientAccount = await createTestAccount("client");
  clientToken = clientAccount.accessToken;
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

describe("Comment API", () => {
  let commentId: string;

  it("should create a new comment when authenticated", async () => {
    const response = await request(app)
      .post("/api/comment")
      .set("Cookie", `accessToken=${clientToken}`)
      .send({
        content: "Test comment Test comment Test comment Test comment",
        name: "vinme",
        approved: false,
        blog: blogId,
      });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe("Comment created successfully");
    expect(response.body.comment).toBeDefined();
    commentId = response.body.comment._id;
  });

  it("should not create a comment without authentication", async () => {
    const response = await request(app).post("/api/comment").send({
      content: "Test comment",
      name: "vinme",
      approved: false,
      blog: blogId,
    });

    expect(response.status).toBe(401);
  });

  it("should get all comments as senior", async () => {
    const response = await request(app)
      .get("/api/comment")
      .set("Cookie", `accessToken=${seniorToken}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Comments fetched successfully");
    expect(response.body.comments).toBeDefined();
  });

  it("should get approved comments for a specific blog", async () => {
    const response = await request(app)
      .get(`/api/comment/${blogId}`)
      .set("Cookie", `accessToken=${clientToken}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe(
      "Approved comments fetched successfully"
    );
    expect(response.body.comments).toBeDefined();
  });

  it("should not allow non-senior users to update comments", async () => {
    const response = await request(app)
      .patch(`/api/comment/${commentId}`)
      .set("Cookie", `accessToken=${clientToken}`)
      .send({ approved: true });

    expect(response.status).toBe(403);
  });

  it("should allow senior users to update a comment", async () => {
    const response = await request(app)
      .patch(`/api/comment/${commentId}`)
      .set("Cookie", `accessToken=${seniorToken}`)
      .send({ approved: true });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Comment approved successfully");
    expect(response.body.comment.approved).toBe(true);
  });

  it("should not allow non-senior users to delete comments", async () => {
    const response = await request(app)
      .delete(`/api/comment/${commentId}`)
      .set("Cookie", `accessToken=${clientToken}`);

    expect(response.status).toBe(403);
  });

  it("should allow senior users to delete a comment", async () => {
    const response = await request(app)
      .delete(`/api/comment/${commentId}`)
      .set("Cookie", `accessToken=${seniorToken}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Comment deleted successfully");
  });
});
