import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import ImageKit from "imagekit";
import authRoutes from "./routes/auth";
import dashboardRoutes from "./routes/dashboard";
import profileRoutes from "./routes/profile";
import clientRoutes from "./routes/client";
import pricingRoutes from "./routes/pricing";
import blogRoutes from "./routes/blogs";
import teamRoutes from "./routes/team";
import courseRoutes from "./routes/courses";
import taskRoutes from "./routes/tasks";
import contactRoutes from "./routes/contact";
import analyticsRoutes from "./routes/analytics";
import commentRoutes from "./routes/comment";
import PortfolioRoute from "./routes/portfolio";
import reviewRoutes from "./routes/review";
import testimonialRoutes from "./routes/testimonial";
import developersRoutes from "./routes/developers";
import userRoutes from "./routes/badge";
import leaderboard from "./routes/leaderboard";
import categoryRoutes from "./routes/category";
import yourLogoRoutes from "./routes/yourlogo";
const app = express();

const imagekit = new ImageKit({
  urlEndpoint: 'https://ik.imagekit.io/cm4yjrvzz',
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!
});

app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/auth/imagekit', function (req, res) {
  const { token, expire, signature } = imagekit.getAuthenticationParameters();
  res.send({ token, expire, signature, publicKey: process.env.IMAGEKIT_PUBLIC_KEY });
});

app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/client", clientRoutes);
app.use("/api/pricing", pricingRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/team", teamRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/testimonials", testimonialRoutes);
app.use("/api/users", userRoutes);
app.use("/api/developers", developersRoutes);
app.use("/api/portfolio", PortfolioRoute);
app.use("/api/comment", commentRoutes);
app.use("/api/leaderboard", leaderboard);
app.use("/api/portfolio-categories", categoryRoutes);
app.use("/api/portfolio", PortfolioRoute);
app.use("/api/comment", commentRoutes);
app.use("/api/yourlogo", yourLogoRoutes);

app.use("/api/reviews", reviewRoutes);
export default app;
