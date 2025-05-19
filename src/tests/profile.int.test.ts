import request from "supertest";
import app from "../server";
import mongoose from "mongoose";
import { createTestAccount } from "./utils/createTestAccount";

let accessToken: string;
beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URL!);
  const account = await createTestAccount("junior");
  accessToken = account.accessToken;
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

describe("Profile API", () => {
  it("should return the profile of the user", async () => {
    const response = await request(app)
      .get("/profile")
      .set("Cookie", `accessToken=${accessToken}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Your profile");
  });
});
