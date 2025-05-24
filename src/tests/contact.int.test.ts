import request from "supertest";
import app from "../server";
import mongoose from "mongoose";
import { createTestAccount } from "./utils/createTestAccount";

let juniorToken: string;
let seniorToken: string;
let juniorUserId: string;
let seniorUserId: string;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URL!);

  const juniorAccount = await createTestAccount("junior");
  juniorToken = juniorAccount.accessToken;
  juniorUserId = juniorAccount.account._id.toString();

  const seniorAccount = await createTestAccount("senior");
  seniorToken = seniorAccount.accessToken;
  seniorUserId = seniorAccount.account._id.toString();
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

describe("Contact API", () => {
  it("should create a contact", async () => {
    const response = await request(app).post("/api/contact").send({
      name: "John Doe",
      email: "john@doe.com",
      subject: "Test Subject",
      message: "Test Message",
    });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe("Contact created successfully");
  });

  it("should get all contacts", async () => {
    const response = await request(app)
      .get("/api/contact")
      .set("Cookie", `accessToken=${seniorToken}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Contacts fetched successfully");
    expect(response.body.contacts.length).toBeGreaterThan(0);
  });
  it("should fail if role is not senior", async () => {
    const response = await request(app)
      .get("/api/contact")
      .set("Cookie", `accessToken=${juniorToken}`);

    expect(response.status).toBe(403);
  });
});
