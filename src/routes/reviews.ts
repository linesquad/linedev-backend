import express from "express";
import {
  createReview,
  getReviewsByCourse,
  updateOwnReview,
  deleteOwnReview,
} from "../controllers/reviews";
import { requireAuth, } from "../middlewares/auth";

const router = express.Router();

// Public routes
router.get("/:courseId", getReviewsByCourse);

// User routes (authenticated)
router.post("/", requireAuth, createReview);
router.put("/:id", requireAuth, updateOwnReview);
router.delete("/:id", requireAuth, deleteOwnReview);


export default router;
