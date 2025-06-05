import request from "supertest";
import app from "../server";
import mongoose from "mongoose";
import { createTestAccount } from "./utils/createTestAccount";

let seniorToken: string;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_TEST_URL!);
  const seniorAccount = await createTestAccount("senior");
  seniorToken = seniorAccount.accessToken;
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

describe("GET Developer Analytics Dashboard", () => {
  it("should return developer analytics for senior developers", async () => {
    const response = await request(app)
      .get("/api/analytics/developers")
      .set("Cookie", `accessToken=${seniorToken}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Analytics fetched successfully");
    expect(response.body.analytics).toBeDefined();
  });

  it("should return 401 if not authenticated", async () => {
    const response = await request(app).get("/api/analytics/developers");
    expect(response.status).toBe(401);
  });
});