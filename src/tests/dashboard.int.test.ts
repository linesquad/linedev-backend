import request from "supertest";
import app from "../server";
import mongoose from "mongoose";
import { createTestAccount } from "./utils/createTestAccount";

let clientToken: string;
let juniorToken: string;
let middleToken: string;
let seniorToken: string;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_TEST_URL!);

  const clientAccount = await createTestAccount("client");
  clientToken = clientAccount.accessToken;
  
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

describe("Dashboard API", () => {
  it("should get client dashboard", async () => {
    const response = await request(app)
      .get("/api/dashboard/client")
      .set("Cookie", `accessToken=${clientToken}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Client Dashboard");
  });

  it("should get junior dashboard", async () => {
    const response = await request(app)
      .get("/api/dashboard/junior")
      .set("Cookie", `accessToken=${juniorToken}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Junior Dashboard");
  });

  it("should get middle dashboard", async () => {
    const response = await request(app)
      .get("/api/dashboard/middle")
      .set("Cookie", `accessToken=${middleToken}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Middle Dashboard");
  });

  it("should get senior dashboard", async () => {
    const response = await request(app)
      .get("/api/dashboard/senior")
      .set("Cookie", `accessToken=${seniorToken}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Senior Dashboard");
  });
});
