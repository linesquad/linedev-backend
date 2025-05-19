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

describe("Dashboard API", () => {
  it("should get junior dashboard", async () => {
    const response = await request(app)
      .get("/dashboard/junior")
      .set("Cookie", `accessToken=${juniorToken}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Hello junior");
  });

  it("should get middle dashboard", async () => {
    const response = await request(app)
      .get("/dashboard/middle")
      .set("Cookie", `accessToken=${middleToken}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Hello middle");
  });

  it("should get senior dashboard", async () => {
    const response = await request(app)
      .get("/dashboard/senior")
      .set("Cookie", `accessToken=${seniorToken}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Hello senior");
  });
});
