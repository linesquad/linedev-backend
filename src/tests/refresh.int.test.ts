import request from "supertest";
import app from "../server";
import mongoose from "mongoose";
import Auth from "../models/Auth";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

let refreshToken: string;
beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URL!);
  const password = await bcrypt.hash("password", 10);
  const admin = await Auth.create({
    name: "test",
    role: "client",
    email: "test@test.com",
    password,
  });
  refreshToken = jwt.sign(
    { id: admin._id },
    process.env.REFRESH_TOKEN_SECRET!,
    {
      expiresIn: "7d",
    }
  );
  admin.refreshToken = refreshToken;
  await admin.save();
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

describe("Refresh Token", () => {
  it("should refresh the token", async () => {
    const res = await request(app)
      .post("/auth/refresh-token")
      .set("Cookie", `refreshToken=${refreshToken}`)
      .expect(200);
    expect(res.body.message).toBe("Token refreshed");
  });
  it("should return 401 if no refresh token is provided", async () => {
    const res = await request(app).post("/auth/refresh-token").expect(401);
    expect(res.body.message).toBe("Unauthorized");
  });
  it("should return 401 if refresh token is invalid", async () => {
    const res = await request(app)
      .post("/auth/refresh-token")
      .set("Cookie", `refreshToken=invalid`)
      .expect(401);
    expect(res.body.message).toBe("Unauthorized");
  });
  it("should fail refresh if refresh token is not matching db", async () => {
    const fakeToken = jwt.sign(
      { id: new mongoose.Types.ObjectId() },
      process.env.REFRESH_TOKEN_SECRET!,
      {
        expiresIn: "7d",
      }
    );
    const res = await request(app)
      .post("/auth/refresh-token")
      .set("Cookie", `refreshToken=${fakeToken}`)
      .expect(401);
    expect(res.body.message).toBe("Unauthorized");
  });
});
