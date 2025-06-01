import { Router } from "express";
import {
  createCategory,
  getCategories,
  getCategoryPortfolios,
  updateCategory,
  deleteCategory,
} from "../controllers/category";
import { requireRole } from "../middlewares/auth";

const router = Router();

//public routes
router.get("/", getCategories);
router.get("/:category", getCategoryPortfolios);

//admin routes
router.post("/", requireRole("senior"), createCategory);
router.put("/:id", requireRole("senior"), updateCategory);
router.delete("/:id", requireRole("senior"), deleteCategory);

export default router;  