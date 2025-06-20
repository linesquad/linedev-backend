import request from "supertest";
import app from "../server";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
process.env.NODE_ENV = "development";

const extractTokens = (response: request.Response) => {
  const rawCookies = response.headers["set-cookie"];

  if (!rawCookies) return { accessToken: undefined, refreshToken: undefined };

  const cookies = Array.isArray(rawCookies) ? rawCookies : [rawCookies];

  const accessToken = cookies
    .find((cookie) => cookie?.startsWith("accessToken"))
    ?.split(";")[0]
    .split("=")[1];

  const refreshToken = cookies
    .find((cookie) => cookie?.startsWith("refreshToken"))
    ?.split(";")[0]
    .split("=")[1];

  return { accessToken, refreshToken };
};

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_TEST_URL!);
});

afterAll(async () => {
  await mongoose.connection.collection("auths").deleteMany({
    email: { $regex: /john\.doe/i },
  });
  await mongoose.connection.close();
});

describe("Auth API", () => {
  it("should register a new junior developer", async () => {
    const response = await request(app).post("/api/auth/register").send({
      name: "John Doe",
      email: "john.doe@example.com",
      password: "password",
      role: "junior",
    });

    const { accessToken, refreshToken } = extractTokens(response);

    expect(response.status).toBe(201);
    expect(response.body.message).toBe("Client created successfully");
    expect(accessToken).toBeDefined();
    expect(refreshToken).toBeDefined();
  });

  it("should register a new middle developer", async () => {
    const response = await request(app).post("/api/auth/register").send({
      name: "John Doe2",
      email: "john.doe2@example.com",
      password: "password",
      role: "middle",
    });

    const { accessToken, refreshToken } = extractTokens(response);

    if (!accessToken || !refreshToken) {
      console.error(
        "Missing cookies in middle developer registration",
        response.headers
      );
    }

    expect(response.status).toBe(201);
    expect(response.body.message).toBe("Client created successfully");
    expect(accessToken).toBeDefined();
    expect(refreshToken).toBeDefined();
  });

  it("should register a new senior developer", async () => {
    const response = await request(app).post("/api/auth/register").send({
      name: "John Doe3",
      email: "john.doe3@example.com",
      password: "password",
      role: "senior",
    });

    const { accessToken, refreshToken } = extractTokens(response);

    if (!accessToken || !refreshToken) {
      console.error(
        "Missing cookies in senior developer registration",
        response.headers
      );
    }

    expect(response.status).toBe(201);
    expect(response.body.message).toBe("Client created successfully");
    expect(accessToken).toBeDefined();
    expect(refreshToken).toBeDefined();
  });

  it("should not register a user with an invalid role", async () => {
    const response = await request(app).post("/api/auth/register").send({
      name: "Invalid Role",
      email: "invalid.role@example.com",
      password: "password",
      role: "invalid",
    });

    expect(response.status).toBe(400);
  });

  it("should not register a user with an existing email", async () => {
    const response = await request(app).post("/api/auth/register").send({
      name: "Duplicate User",
      email: "john.doe@example.com",
      password: "password",
      role: "junior",
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("User already exists");
  });

  it("should login a junior developer", async () => {
    const response = await request(app).post("/api/auth/login").send({
      email: "john.doe@example.com",
      password: "password",
    });

    const { accessToken, refreshToken } = extractTokens(response);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Login successful");
    expect(response.body.role).toBe("junior");
    expect(accessToken).toBeDefined();
    expect(refreshToken).toBeDefined();
  });

  it("should not login a user with an invalid password", async () => {
    const response = await request(app).post("/api/auth/login").send({
      email: "john.doe@example.com",
      password: "wrongpassword",
    });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Password is incorrect");
  });

  it("should not login a user with an invalid email", async () => {
    const response = await request(app).post("/api/auth/login").send({
      email: "not.exists@example.com",
      password: "password",
    });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Invalid credentials");
  });

  it("should login a middle developer", async () => {
    const response = await request(app).post("/api/auth/login").send({
      email: "john.doe2@example.com",
      password: "password",
    });

    const { accessToken, refreshToken } = extractTokens(response);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Login successful");
    expect(response.body.role).toBe("middle");
    expect(accessToken).toBeDefined();
    expect(refreshToken).toBeDefined();
  });

  it("should login a senior developer", async () => {
    const response = await request(app).post("/api/auth/login").send({
      email: "john.doe3@example.com",
      password: "password",
    });

    const { accessToken, refreshToken } = extractTokens(response);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Login successful");
    expect(response.body.role).toBe("senior");
    expect(accessToken).toBeDefined();
    expect(refreshToken).toBeDefined();
  });

  it("should refresh a token", async () => {
    const loginResponse = await request(app).post("/api/auth/login").send({
      email: "john.doe@example.com",
      password: "password",
    });

    const { refreshToken } = extractTokens(loginResponse);

    const response = await request(app)
      .post("/api/auth/refresh-token")
      .set("Cookie", [`refreshToken=${refreshToken}`]);

    const { accessToken: newAccessToken } = extractTokens(response);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Token refreshed");
    expect(newAccessToken).toBeDefined();
  });

  it("should logout a client", async () => {
    const response = await request(app).post("/api/auth/logout");

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Logout successful");
  });
});
