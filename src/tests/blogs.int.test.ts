import request from "supertest";
import app from "../server";
import mongoose from "mongoose";
import { createTestAccount } from "./utils/createTestAccount";

let juniorToken: string;
let middleToken: string;
let seniorToken: string;
let juniorUserId: string;
let middleUserId: string;
let seniorUserId: string;

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

describe("Blogs API", () => {
  let id: string;
  it("should create a blog", async () => {
    const response = await request(app)
      .post("/api/blogs")
      .set("Cookie", `accessToken=${seniorToken}`)
      .send({
        title: "Test Blog",
        content: "Test Content",
        author: seniorUserId,
        tags: ["Test Tag"],
        category: "Test Category",
        isFeatured: true,
      });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe("Blog created successfully");
    id = response.body.data._id;
  });

  it("should get all blogs", async () => {
    const response = await request(app).get("/api/blogs");

    expect(response.status).toBe(200);
    expect(response.body.blogs).toBeDefined();
  });

  it("should get a blog by id", async () => {
    const response = await request(app).get(`/api/blogs/${id}`);

    expect(response.status).toBe(200);
    expect(response.body.data).toBeDefined();
  });

  it("should update a blog by id", async () => {
    const response = await request(app)
      .put(`/api/blogs/${id}`)
      .set("Cookie", `accessToken=${seniorToken}`)
      .send({
        title: "Updated Blog",
        content: "Updated Content",
        author: seniorUserId,
      });

    expect(response.status).toBe(200);
    expect(response.body.data).toBeDefined();
  });

  it("should not update a blog if account is junior", async () => {
    const response = await request(app)
      .put(`/api/blogs/${id}`)
      .set("Cookie", `accessToken=${juniorToken}`)
      .send({
        title: "Updated Blog",
      });

    expect(response.status).toBe(403);
    expect(response.body.message).toBe(
      "Forbidden: junior is not allowed to access this resource"
    );
  });

  it("should not delete a blog if account is junior", async () => {
    const response = await request(app)
      .delete(`/api/blogs/${id}`)
      .set("Cookie", `accessToken=${juniorToken}`);

    expect(response.status).toBe(403);
    expect(response.body.message).toBe(
      "Forbidden: junior is not allowed to access this resource"
    );
  });

  it("should delete a blog by id", async () => {
    const response = await request(app)
      .delete(`/api/blogs/${id}`)
      .set("Cookie", `accessToken=${middleToken}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Blog deleted successfully");
  });
});
