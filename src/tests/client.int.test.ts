import request from "supertest";
import app from "../server";
import mongoose from "mongoose";
import { createTestAccount } from "./utils/createTestAccount";

let juniorToken: string;
let middleToken: string;
let seniorToken: string;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URL!);

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

describe("Client API", () => {
  let id: string;
  it("should create a new client", async () => {
    const response = await request(app)
      .post("/api/client")
      .set("Cookie", `accessToken=${juniorToken}`)
      .send({
        name: "John Doe",
        email: "john.doe@example.com",
        phone: "1234567890",
        services: ["Service 1", "Service 2"],
        message: "This is a test message",
      });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe("Client created successfully");
    id = response.body._id;
  });

  it("should get all clients", async () => {
    const response = await request(app)
      .get("/api/client")
      .set("Cookie", `accessToken=${seniorToken}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Clients fetched successfully");
  });

  it("should fail if role is not senior", async () => {
    const response = await request(app)
      .get("/api/client")
      .set("Cookie", `accessToken=${juniorToken}`);

    expect(response.status).toBe(403);
    expect(response.body.message).toBe("Forbidden: junior is not allowed to access this resource");
  });

  it("should delete a client", async () => {
    const response = await request(app)
      .delete(`/api/client/${id}`)
      .set("Cookie", `accessToken=${seniorToken}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Client deleted successfully");
  });
});
