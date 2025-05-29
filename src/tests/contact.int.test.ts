import request from "supertest";
import app from "../server";
import mongoose from "mongoose";
import { createTestAccount } from "./utils/createTestAccount";

let juniorToken: string;
let seniorToken: string;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URL!);

  const juniorAccount = await createTestAccount("junior");
  juniorToken = juniorAccount.accessToken;

  const seniorAccount = await createTestAccount("senior");
  seniorToken = seniorAccount.accessToken;
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

describe("Contact API", () => {
  let id: string;
  it("should create a contact", async () => {
    const response = await request(app).post("/api/contact").send({
      name: "John Doe",
      email: "john@doe.com",
      subject: "Test Subject",
      message: "Test Message",
    });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe("Contact created successfully");
    id = response.body.contact._id;
  });

  it("should get all contacts", async () => {
    const response = await request(app)
      .get("/api/contact")
      .set("Cookie", `accessToken=${seniorToken}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Contacts fetched successfully");
    expect(response.body.contacts.length).toBeGreaterThan(0);
  });

  it("should update contact status", async () => {
    const response = await request(app)
      .patch(`/api/contact/${id}/status`)
      .set("Cookie", `accessToken=${seniorToken}`)
      .send({ status: "in review" });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Contact status updated successfully");
    expect(response.body.data.status).toBe("in review");
  });

  it("should fail if role is not senior", async () => {
    const response = await request(app)
      .get("/api/contact")
      .set("Cookie", `accessToken=${juniorToken}`);

    expect(response.status).toBe(403);
  });

  it("should delete contact", async () => {
    const response = await request(app)
      .delete(`/api/contact/${id}`)
      .set("Cookie", `accessToken=${seniorToken}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Contact deleted successfully");
  });
});
