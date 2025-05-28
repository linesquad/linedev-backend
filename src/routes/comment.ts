import { Router } from "express";
import {
  createComment,
  getAllComments,
  getApprovedComments,
  approveComment,
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
 *             required:
 *               - name
 *               - content
 *               - blog
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of commenter
 *               content:
 *                 type: string
 *                 description: Content of the comment
 *               blog:
 *                 type: string
 *                 description: ID of the blog post
 *               approved:
 *                 type: boolean
 *                 default: false
 *                 description: Approval status of comment
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 comments:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Comment'
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
 *         description: ID of the blog post
 *     responses:
 *       200:
 *         description: Approved comments fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 comments:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Comment'
 *       401:
 *         description: Unauthorized
 *
 *   patch:
 *     summary: Update a comment approval status (senior only)
 *     tags: [Comments]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: blogId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the comment
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - approved
 *             properties:
 *               approved:
 *                 type: boolean
 *                 description: New approval status
 *     responses:
 *       200:
 *         description: Comment updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 comment:
 *                   $ref: '#/components/schemas/Comment'
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
 *         name: blogId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the comment to delete
 *     responses:
 *       200:
 *         description: Comment deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 deletedComment:
 *                   $ref: '#/components/schemas/Comment'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Senior access required
 */

router.post("/", requireAuth, createComment);
router.get("/:blogId", requireAuth, getApprovedComments);

//private routes
router.get("/", requireRole("senior"), getAllComments);
router.patch("/:blogId", requireRole("senior"), approveComment);
router.delete("/:blogId", requireRole("senior"), deleteComment);

export default router;
