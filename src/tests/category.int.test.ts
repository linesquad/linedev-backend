import request from "supertest";
import app from "../server";
import mongoose from "mongoose";
import { createTestAccount } from "./utils/createTestAccount";

let juniorToken: string;
let seniorToken: string;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_TEST_URL!);

  const juniorAccount = await createTestAccount("junior");
  juniorToken = juniorAccount.accessToken;

  const seniorAccount = await createTestAccount("senior");
  seniorToken = seniorAccount.accessToken;
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

describe("Category API", () => {
  let id: string;
  it("should create a category", async () => {
    const response = await request(app)
      .post("/api/portfolio-categories")
      .set("Cookie", `accessToken=${seniorToken}`)
      .send({
        name: "Test Category",
        slug: "test-category",
      });

    expect(response.status).toBe(201);
    expect(response.body).toBeDefined();
    id = response.body._id.toString();
  });

  it("should get all categories", async () => {
    const response = await request(app).get("/api/portfolio-categories");

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it("should get category portfolios", async () => {
    const response = await request(app).get(`/api/portfolio?category=${id}`);

    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();

  });

  it("should update a category", async () => {
    const response = await request(app)
      .put(`/api/portfolio-categories/${id}`)
      .set("Cookie", `accessToken=${seniorToken}`)
      .send({
        name: "Updated Category",
      });

    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
  });

  it("should not update a category if account is junior", async () => {
    const response = await request(app)
      .put(`/api/portfolio-categories/${id}`)
      .set("Cookie", `accessToken=${juniorToken}`)
      .send({
        name: "Updated Category",
      });

    expect(response.status).toBe(403);
  });

  it("should not delete a category if account is junior", async () => {
    const response = await request(app)
      .delete(`/api/portfolio-categories/${id}`)
      .set("Cookie", `accessToken=${juniorToken}`);

    expect(response.status).toBe(403);
  });

  it("should delete a category", async () => {
    const response = await request(app)
      .delete(`/api/portfolio-categories/${id}`)
      .set("Cookie", `accessToken=${seniorToken}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Category deleted successfully");
  });
});