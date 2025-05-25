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

describe("Portfolio API", () => {
  let portfolioId: string;

  it("should create a new portfolio", async () => {
    const response = await request(app)
      .post("/api/portfolio")
      .set("Cookie", `accessToken=${seniorToken}`)
      .send({
        title: 'Test Portfolio',
      description: 'A cool project about something',
      technologies: ['React', 'TypeScript', 'Zod'],
      projectUrl: 'https://example.com',
      images: ['https://example.com/image1.jpg', 'https://example.com/image2.jpg']
      });

    expect(response.status).toBe(201);
    expect(response.body.data.title).toBe("Test Portfolio");
    portfolioId = response.body.data._id;
  });

  it("should get all portfolios", async () => {
    const response = await request(app)
      .get("/api/portfolio")
      .set("Cookie", `accessToken=${juniorToken}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it("should get a portfolio by ID", async () => {
    const response = await request(app)
      .get(`/api/portfolio/${portfolioId}`)
      .set("Cookie", `accessToken=${juniorToken}`);

    expect(response.status).toBe(200);
    expect(response.body.portfolio._id).toBe(portfolioId);
    expect(response.body.message).toBe("succes");
  });

  it("should update a portfolio", async () => {
    const response = await request(app)
      .put(`/api/portfolio/${portfolioId}`)
      .set("Cookie", `accessToken=${seniorToken}`)
      .send({
        title: "Updated Portfolio",
        description: "Updated description",
      });

    expect(response.status).toBe(200);
    expect(response.body.updated.title).toBe("Updated Portfolio");
  });

  it("should delete a portfolio", async () => {
    const response = await request(app)
      .delete(`/api/portfolio/${portfolioId}`)
      .set("Cookie", `accessToken=${seniorToken}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Portfolio deleted successfully");
  });

  it("should return 404 for non-existing portfolio", async () => {
    const response = await request(app)
      .get("/api/portfolio/507f1f77bcf86cd799439011")
      .set("Cookie", `accessToken=${seniorToken}`);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Portfolio not found");
  });
});
