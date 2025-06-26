import request from "supertest";
import mongoose, { Types } from "mongoose";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import app from "../server";
import Auth from "../models/Auth";
import Portfolio from "../models/Portfolio";

dotenv.config();

let token: string;
let portfolioId: string;
let unusedId: string;
let dummyCategoryId: Types.ObjectId;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_TEST_URL!);

  // Create a senior user
  const hashedPassword = await bcrypt.hash("test1234", 10);
  const user = await Auth.create({
    name: "Portfolio Admin",
    email: "portfolio.admin@example.com",
    password: hashedPassword,
    role: "senior",
  });

  token = jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN_SECRET!, {
    expiresIn: "1h",
  });

  // Use dummy category ID (simulate related ref)
  dummyCategoryId = new Types.ObjectId();
  unusedId = new Types.ObjectId().toHexString();
});

afterAll(async () => {
  await Portfolio.deleteMany();
  await Auth.deleteMany();
  await mongoose.connection.close();
});

describe("Portfolio API", () => {
  it("should create a portfolio", async () => {
    const res = await request(app)
      .post("/api/portfolio")
      .set("Cookie", [`accessToken=${token}`])
      .send({
        title: "Awesome Project",
        description: "This is a portfolio project.",
        technologies: ["React", "Node.js"],
        projectUrl: "https://example.com/project",
        images: ["https://example.com/image1.jpg"],
        category: dummyCategoryId.toString(),
      });

    expect(res.status).toBe(201);
    expect(res.body.data.title).toBe("Awesome Project");
    portfolioId = res.body.data._id;
  });

  it("should get all portfolios", async () => {
    const res = await request(app).get("/api/portfolio");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it("should get portfolio by ID", async () => {
    const res = await request(app).get(`/api/portfolio/${portfolioId}`);
    expect(res.status).toBe(200);
    expect(res.body.portfolio._id).toBe(portfolioId);
  });

  it("should return 404 for non-existing portfolio ID", async () => {
    const res = await request(app).get(`/api/portfolio/${unusedId}`);
    expect(res.status).toBe(404);
    expect(res.body.message).toBe("Portfolio not found");
  });

  it("should update the portfolio", async () => {
    const res = await request(app)
      .put(`/api/portfolio/${portfolioId}`)
      .set("Cookie", [`accessToken=${token}`])
      .send({
        title: "Updated Portfolio Title",
      });

    expect(res.status).toBe(200);
    expect(res.body.updated.title).toBe("Updated Portfolio Title");
  });

  it("should return 404 when updating non-existing portfolio", async () => {
    const res = await request(app)
      .put(`/api/portfolio/${unusedId}`)
      .set("Cookie", [`accessToken=${token}`])
      .send({
        title: "Ghost Update",
      });

    expect(res.status).toBe(404);
    expect(res.body.message).toBe("Portfolio not found");
  });

  it("should delete the portfolio", async () => {
    const res = await request(app)
      .delete(`/api/portfolio/${portfolioId}`)
      .set("Cookie", [`accessToken=${token}`]);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Portfolio deleted successfully");
  });

  it("should return 404 when deleting non-existing portfolio", async () => {
    const res = await request(app)
      .delete(`/api/portfolio/${unusedId}`)
      .set("Cookie", [`accessToken=${token}`]);

    expect(res.status).toBe(404);
    expect(res.body.message).toBe("Portfolio not found");
  });
});
