import { Router } from "express";
import {
  createComment,
  getAllComments,
  getApprovedComments,
  updateComment,
  deleteComment,
} from "../controllers/comment";
import { requireAuth, requireRole } from "../middlewares/auth";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Comments
 *   description: Comment management endpoints
 *
 * /api/comment:
 *   post:
 *     summary: Create a new comment
 *     tags: [Comments]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               content:
 *                 type: string
 *               approved:
 *                 type: boolean
 *               blogId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Comment created successfully
 *       401:
 *         description: Unauthorized
 *   get:
 *     summary: Get all comments (senior only)
 *     tags: [Comments]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Comments fetched successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Senior access required
 *
 * /api/comment/{blogId}:
 *   get:
 *     summary: Get approved comments for a specific blog
 *     tags: [Comments]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: blogId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Approved comments fetched successfully
 *       401:
 *         description: Unauthorized
 *
 * /api/comment/{id}:
 *   put:
 *     summary: Update a comment (senior only)
 *     tags: [Comments]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               approved:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Comment updated successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Senior access required
 *   delete:
 *     summary: Delete a comment (senior only)
 *     tags: [Comments]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Comment deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Senior access required
 */

router.post("/", requireAuth, createComment);
router.get("/:blogId", requireAuth, getApprovedComments);
router.get("/", requireRole("senior"), getAllComments);
router.put("/:id", requireRole("senior"), updateComment);
router.delete("/:id", requireRole("senior"), deleteComment);

export default router;
