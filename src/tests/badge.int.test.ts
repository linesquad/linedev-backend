import request from "supertest";
import app from "../server";
import mongoose from "mongoose";
import { createTestAccount } from "./utils/createTestAccount";

let seniorToken: string;
let seniorAccountId: string;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URL!);
  const seniorAccount = await createTestAccount("senior");
  seniorToken = seniorAccount.accessToken;
  seniorAccountId = seniorAccount.account._id.toString();
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

describe("User API", () => {
  it("should update skills", async () => {
    const response = await request(app)
      .patch(`/api/users/${seniorAccountId}/skills`)
      .set("Cookie", `accessToken=${seniorToken}`)
      .send({ skills: ["JavaScript", "MongoDB"] });
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Skills updated successfully");
  });

  it("should add a badge", async () => {
    const response = await request(app)
      .patch(`/api/users/${seniorAccountId}/badges`)
      .set("Cookie", `accessToken=${seniorToken}`)
      .send({
        title: "Badge 1",
        description: "Badge 1 description",
        iconUrl: "https://via.placeholder.com/150",
      });
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Badge added successfully");
  });
});
