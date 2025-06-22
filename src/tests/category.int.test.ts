import request from "supertest";
import mongoose from "mongoose";
import app from "../server"; // შენი express აპის მთავარი ფაილი
import Category from "../models/Category";
import dotenv from "dotenv";

dotenv.config();

// mock middleware requireRole, რომ ავტორიზაცია გაივლის ავტომატურად
jest.mock("../middlewares/auth", () => {
  return {
    requireRole: (...roles: string[]) => {
      return (req: any, res: any, next: any) => {
        req.user = { role: "senior", _id: "mockUserId" };
        next();
      };
    },
    requireAuth: (req: any, res: any, next: any) => {
      req.user = { role: "senior", _id: "mockUserId" };
      next();
    },
  };
});

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_TEST_URL!, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } as any);
});

afterAll(async () => {
  await mongoose.connection.close();
});

beforeEach(async () => {
  await Category.deleteMany({});
});

describe("Category API Integration Tests", () => {
  it("should create a new category", async () => {
    const res = await request(app).post("/api/portfolio-categories").send({
      name: "Test Category",
      slug: "test-category",
    });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("_id");
    expect(res.body.name).toBe("Test Category");
    expect(res.body.slug).toBe("test-category");
  });

  it("should get all categories", async () => {
    await Category.create({ name: "Category One", slug: "cat-one" });

    const res = await request(app).get("/api/portfolio-categories");

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0]).toHaveProperty("name");
  });

  it("should get portfolios by category slug", async () => {
    const category = await Category.create({
      name: "Portfolio Category",
      slug: "portfolio-category",
    });

    // Portfolio მოდელის იმპორტი
    const Portfolio = require("../models/Portfolio").default;

    // შექმენი portfolio რომ category-ს მივაკუთვნო
    await Portfolio.create({
      title: "Portfolio Item 1",
      category: category._id,
      description: "Test portfolio description",
      projectUrl: "https://example.com/project1",
      // ჩაწერე საჭირო სხვა ველები თუ საჭიროა
    });

    const res = await request(app).get(
      `/api/portfolio-categories/${category.slug}`
    );

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0]).toHaveProperty("title", "Portfolio Item 1");
  });

  it("should update a category", async () => {
    const category = await Category.create({
      name: "Old Name",
      slug: "old-slug",
    });

    const res = await request(app)
      .put(`/api/portfolio-categories/${category._id}`)
      .send({ name: "Updated Name", slug: "updated-slug" });

    expect(res.status).toBe(200);
    expect(res.body.name).toBe("Updated Name");
    expect(res.body.slug).toBe("updated-slug");
  });

  it("should delete a category", async () => {
    const category = await Category.create({
      name: "To Be Deleted",
      slug: "to-be-deleted",
    });

    const res = await request(app).delete(
      `/api/portfolio-categories/${category._id}`
    );

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Category deleted successfully");

    // გადაამოწმე რომ წაიშალა
    const found = await Category.findById(category._id);
    expect(found).toBeNull();
  });
});
