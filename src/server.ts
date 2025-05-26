import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth";
import dashboardRoutes from "./routes/dashboard";
import profileRoutes from "./routes/profile";
import clientRoutes from "./routes/client";
import pricingRoutes from "./routes/pricing";
import blogRoutes from "./routes/blogs";
import teamRoutes from "./routes/team";
import courseRoutes from "./routes/courses";
import syllabusRoutes from "./routes/syllabus";
const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/client", clientRoutes);
app.use("/api/pricing", pricingRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/team", teamRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/syllabus", syllabusRoutes);
export default app;
