import request from "supertest";
import app from "../server";
import mongoose from "mongoose";
import { createTestAccount } from "./utils/createTestAccount";

let juniorToken: string;
let middleToken: string;
let seniorToken: string;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_TEST_URL!);

  const juniorAccount = await createTestAccount("junior");
  juniorToken = juniorAccount.accessToken;

  const middleAccount = await createTestAccount("middle");
  middleToken = middleAccount.accessToken;

  const seniorAccount = await createTestAccount("senior");
  seniorToken = seniorAccount.accessToken;
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

describe("Leaderboard API", () => {
  it("should get top 10 leaderboard for public endpoint", async () => {
    const response = await request(app).get("/api/leaderboard/all");

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Top 10 developers fetched");
    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body.data.length).toBeLessThanOrEqual(10);

    const firstEntry = response.body.data[0];
    expect(firstEntry).toHaveProperty("name");
    expect(firstEntry).toHaveProperty("totalCompletedTasks");
  });

  it("should allow senior to get full leaderboard", async () => {
    const response = await request(app)
      .get("/api/leaderboard/full")
      .set("Cookie", `accessToken=${seniorToken}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Full leaderboard fetched");
  });

  it("should forbid junior from accessing full leaderboard", async () => {
    const response = await request(app)
      .get("/api/leaderboard/full")
      .set("Cookie", `accessToken=${juniorToken}`);

    expect(response.status).toBe(403);
    expect(response.body.message).toBe(
      "Forbidden: junior is not allowed to access this resource"
    );
  });

  it("should forbid middle from accessing full leaderboard", async () => {
    const response = await request(app)
      .get("/api/leaderboard/full")
      .set("Cookie", `accessToken=${middleToken}`);

    expect(response.status).toBe(403);
    expect(response.body.message).toBe(
      "Forbidden: middle is not allowed to access this resource"
    );
  });

  it("should forbid access to full leaderboard without token", async () => {
    const response = await request(app).get("/api/leaderboard/full");

    expect(response.status).toBe(401);
  });
});
