import { Router } from "express";
import { createComment, getAllComments, getApprovedComments, updateComment, deleteComment } from "../controllers/comment";
import { requireAuth, requireRole } from "../middlewares/auth";

const router = Router();

//public routes but with auth
router.post("/", requireAuth, createComment);
router.get("/:blogId", requireAuth, getApprovedComments);

//private routes
router.get("/", requireRole("senior"), getAllComments);
router.put("/:id", requireRole("senior"), updateComment);
router.delete("/:id", requireRole("senior"), deleteComment);

export default router;