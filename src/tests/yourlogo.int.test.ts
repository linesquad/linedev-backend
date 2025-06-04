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

describe("Your Logo", () => {
  let yourLogoId: string;
  it("should create a new your logo", async () => {
    const response = await request(app)
      .post("/api/yourlogo")
      .set("Cookie", `accessToken=${seniorToken}`)
      .send({ name: "Your Logo", image: "https://yourlogo.com/image.png" });
    expect(response.status).toBe(201);
    expect(response.body.message).toBe("Your logo created successfully");
    expect(response.body.data.name).toBe("Your Logo");
    expect(response.body.data.image).toBe("https://yourlogo.com/image.png");
    yourLogoId = response.body.data._id;
  });

  it("should get all your logos", async () => {
    const response = await request(app).get("/api/yourlogo");
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Your logo fetched successfully");
    expect(response.body.data.length).toBe(1);
    expect(response.body.data[0].name).toBe("Your Logo");
    expect(response.body.data[0].image).toBe("https://yourlogo.com/image.png");
  });

  it("should update a your logo", async () => {
    const response = await request(app)
      .put(`/api/yourlogo/${yourLogoId}`)
      .set("Cookie", `accessToken=${seniorToken}`)
      .send({
        name: "Your Logo Updated",
        image: "https://yourlogo.com/image.png",
      });
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Your logo updated successfully");
    expect(response.body.data.name).toBe("Your Logo Updated");
    expect(response.body.data.image).toBe("https://yourlogo.com/image.png");
  });

  it("should delete a your logo", async () => {
    const response = await request(app)
      .delete(`/api/yourlogo/${yourLogoId}`)
      .set("Cookie", `accessToken=${seniorToken}`);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Your logo deleted successfully");
  });
});