import { Router } from "express";
import { createTestimonial, getTestimonials, updateTestimonial, deleteTestimonial } from "../controllers/testimonial";
import { requireAuth, requireRole } from "../middlewares/auth";

const router = Router();

//public routes
router.get("/", requireAuth, getTestimonials);

//private routes
router.post("/", requireRole("senior"), createTestimonial);
router.put("/:id", requireRole("senior"), updateTestimonial);
router.delete("/:id", requireRole("senior"), deleteTestimonial);

export default router;