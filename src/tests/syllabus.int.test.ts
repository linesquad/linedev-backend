import request from "supertest";
import app from "../server";
import mongoose from "mongoose";
import { createTestAccount } from "./utils/createTestAccount";

let seniorToken: string;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URL!);

  const seniorAccount = await createTestAccount("senior");
  seniorToken = seniorAccount.accessToken;
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

describe("Syllabus API", () => {
  let id: string;
  it("should create a new syllabus", async () => {
    const response = await request(app)
      .post("/api/syllabus")
      .set("Cookie", `accessToken=${seniorToken}`)
      .send({
        title: "Test Syllabus",
        description: "Test Description",
        week: "1 week",
      });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe("Syllabus created successfully");
    expect(response.body.data._id).toBeDefined();
    id = response.body.data._id;
  });

  it("should get all syllabuses", async () => {
    const response = await request(app).get("/api/syllabus");

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Syllabus fetched successfully");
  });

  it("should update a syllabus", async () => {
    const response = await request(app)
      .put(`/api/syllabus/${id}`)
      .set("Cookie", `accessToken=${seniorToken}`)
      .send({ title: "Updated Syllabus" });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Syllabus updated successfully");
  });

  it("should delete a syllabus", async () => {
    const response = await request(app)
      .delete(`/api/syllabus/${id}`)
      .set("Cookie", `accessToken=${seniorToken}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Syllabus deleted successfully");
  });
});
