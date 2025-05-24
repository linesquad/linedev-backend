import request from "supertest";
import app from "../server";
import mongoose from "mongoose";
import { createTestAccount } from "./utils/createTestAccount";


let seniorToken: string;


beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URL!);

  const seniorAccount = await createTestAccount("senior");
  seniorToken = seniorAccount.accessToken;

});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

describe("Team API", () => {
  let id: string;
  let rank: string;
  it("should create a team member", async () => {
    const response = await request(app)
      .post("/api/team")
      .set("Cookie", `accessToken=${seniorToken}`)
      .send({
        name: "John Doe",
        bio: "John Doe is a software engineer",
        rank: "middle",
        skills: ["React", "Node.js", "MongoDB"],
        image: "https://example.com/image.png",
        projectUrl: [
          "https://example.com/project1",
          "https://example.com/project2",
        ],
        projectImages: [
          "https://example.com/image1.png",
          "https://example.com/image2.png",
        ],
      });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe("Team created successfully");
    id = response.body.data._id;
    rank = response.body.data.rank;
  });

  it("should get all team members", async () => {
    const response = await request(app).get("/api/team");
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Team fetched successfully");
    expect(response.body.data.length).toBeGreaterThan(0);
  });

  it("should get a team member by rank", async () => {
    const response = await request(app).get(`/api/team/${rank}`);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Team fetched successfully");
  });

  it("should update a team member", async () => {
    const response = await request(app)
      .put(`/api/team/${id}`)
      .set("Cookie", `accessToken=${seniorToken}`)
      .send({
        name: "John Doe",
        bio: "John Doe is a software engineer",
        skills: ["React", "Node.js", "MongoDB"],
        image: "https://example.com/image.png",
        projectUrl: [
          "https://example.com/project1",
          "https://example.com/project2",
        ],
        projectImages: [
          "https://example.com/image1.png",
          "https://example.com/image2.png",
        ],
      });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Team updated successfully");
  });

  it("should delete a team member", async () => {
    const response = await request(app)
      .delete(`/api/team/${id}`)
      .set("Cookie", `accessToken=${seniorToken}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Team deleted successfully");
  });
});
