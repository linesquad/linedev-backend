import request from "supertest";
import app from "../server";
import mongoose from "mongoose";
import { createTestAccount } from "./utils/createTestAccount";

let accessToken: string;
let developerId: string;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URL!);

  const account = await createTestAccount("client");
  accessToken = account.accessToken;
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

describe("Developer API (with auth)", () => {
  it("should create a developer", async () => {
    const response = await request(app)
      .post("/api/developers")
      .set("Cookie", `accessToken=${accessToken}`)
      .send({
        name: "Giorgi Dev",
        rank: "senior",
        bio: "Loves Node.js",
        skills: ["Node.js", "MongoDB"],
        profileImage: "https://example.com/image.jpg",
        tasks: [],
      });

    expect(response.status).toBe(201);
    expect(response.body.data.name).toBe("Giorgi Dev");
    developerId = response.body.data._id;
  });

  it("should fetch all developers", async () => {
    const response = await request(app)
      .get("/api/developers")
      .set("Cookie", `accessToken=${accessToken}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.data)).toBe(true);
  });

  it("should get a developer by ID", async () => {
    const response = await request(app)
      .get(`/api/developers/${developerId}`)
      .set("Cookie", `accessToken=${accessToken}`);

    expect(response.status).toBe(200);
    expect(response.body.data._id).toBe(developerId);
  });

  it("should update a developer", async () => {
    const response = await request(app)
      .put(`/api/developers/${developerId}`)
      .set("Cookie", `accessToken=${accessToken}`)
      .send({
        bio: "Updated bio info",
      });

    expect(response.status).toBe(200);
    expect(response.body.data.bio).toBe("Updated bio info");
  });

  it("should delete a developer", async () => {
    const response = await request(app)
      .delete(`/api/developers/${developerId}`)
      .set("Cookie", `accessToken=${accessToken}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Developer deleted successfully");
  });

  it("should return 404 when developer not found", async () => {
    const response = await request(app)
      .get(`/api/developers/${developerId}`)
      .set("Cookie", `accessToken=${accessToken}`);

    expect(response.status).toBe(404);
  });
});
