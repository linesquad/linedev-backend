import request from "supertest";
import app from "../server";
import mongoose from "mongoose";
import { createTestAccount } from "./utils/createTestAccount";

let seniorToken: string;
let juniorToken: string;
beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URL!);
  const seniorAccount = await createTestAccount("senior");
  seniorToken = seniorAccount.accessToken;

  const junior = await createTestAccount("junior")
  juniorToken = junior.accessToken
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

describe("Testimonial API", () => {
  let testimonialId: string;
  it("should create a testimonial", async () => {
    const response = await request(app)
      .post("/api/testimonials")
      .set("Cookie", `accessToken=${seniorToken}`)
      .send({
        name: "vinme",
        jobTitle: "Software Engineer",
        quote: "This is a test testimonial",
        imageUrl: "https://via.placeholder.com/150",
      });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe("Testimonial created successfully");
    testimonialId = response.body.testimonial._id;
  });

  it("should get all testimonials", async () => { 
    const response = await request(app).get("/api/testimonials").set("Cookie", `accessToken=${juniorToken}`);
    expect(response.status).toBe(200);
    expect(response.body.testimonials).toBeDefined();
  });

  it("should update a testimonial", async () => {
    const response = await request(app)
      .put(`/api/testimonials/${testimonialId}`)
      .set("Cookie", `accessToken=${seniorToken}`)
      .send({
        name: "vinme updated",
        jobTitle: "Software Engineer updated",
        quote: "This is a test testimonial updated",
        imageUrl: "https://via.placeholder.com/150 updated",
      });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Testimonial updated successfully");
  });

  it("should delete a testimonial", async () => {
    const response = await request(app)
      .delete(`/api/testimonials/${testimonialId}`)
      .set("Cookie", `accessToken=${seniorToken}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Testimonial deleted successfully");
  });
});
