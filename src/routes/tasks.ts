import {
  createTask,
  deleteTask,
  getMyTasks,
  getTaskById,
  getTasks,
  updateTask,
} from "../controllers/tasks";
import { validate } from "../middlewares/validate";
import {
  addFeedbackSchema,
  createTaskSchema,
  updateTaskSchema,
} from "../validators/tasks";
import { requireAuth, requireRole } from "../middlewares/auth";
import { Router } from "express";
import {
  addFeedback,
  getFeedback,
  deleteFeedback,
} from "../controllers/feedback";

const router = Router();

//private routes
router.post("/", requireRole("senior"), validate(createTaskSchema), createTask);

router.get("/", requireRole("junior", "middle", "senior"), getTasks);

router.get(
  "/mine",
  requireAuth,
  requireRole("junior", "middle", "senior"),
  getMyTasks
);

router.get("/:id", requireRole("junior", "middle", "senior"), getTaskById);

router.put(
  "/:id",
  requireRole("senior"),
  validate(updateTaskSchema),
  updateTask
);

router.delete("/:id", requireRole("senior"), deleteTask);

//feedback private routes

router.post(
  "/:taskId/feedback",
  requireRole("senior"),
  validate(addFeedbackSchema),
  addFeedback
);

router.get(
  "/:taskId/feedback",
  requireRole("senior", "junior", "middle"),
  getFeedback
);

router.delete(
  "/:taskId/feedback/:feedbackId",
  requireRole("senior"),
  deleteFeedback
);

export default router;

/**
 * @swagger
 * components:
 *   schemas:
 *     Task:
 *       type: object
 *       required:
 *         - title
 *         - description
 *         - status
 *         - dueDate
 *         - assignedTo
 *         - priority
 *       properties:
 *         title:
 *           type: string
 *           description: Title of the task
 *         description:
 *           type: string
 *           description: Detailed description of the task
 *         status:
 *           type: string
 *           enum: [pending, in progress, done]
 *           description: Current status of the task
 *         dueDate:
 *           type: string
 *           format: date-time
 *           description: Due date for the task
 *         assignedTo:
 *           type: string
 *           description: ID of the user assigned to the task
 *         priority:
 *           type: string
 *           enum: [low, medium, high]
 *           description: Priority level of the task
 *         subtasks:
 *           type: array
 *           description: List of subtasks
 *           items:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *                 description: Title of the subtask
 *               done:
 *                 type: boolean
 *                 description: Completion status of subtask
 *                 default: false
 *
 * /api/tasks:
 *   post:
 *     summary: Create a new task
 *     tags: [Tasks]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Task'
 *     responses:
 *       201:
 *         description: Task created successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Only senior role can create tasks
 *
 *   get:
 *     summary: Get all tasks
 *     tags: [Tasks]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of all tasks
 *       401:
 *         description: Unauthorized
 *
 * /api/tasks/{id}:
 *   get:
 *     summary: Get task by ID
 *     tags: [Tasks]
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
 *         description: Task details
 *       404:
 *         description: Task not found
 *       401:
 *         description: Unauthorized
 *
 *   put:
 *     summary: Update task by ID
 *     tags: [Tasks]
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
 *             $ref: '#/components/schemas/Task'
 *     responses:
 *       200:
 *         description: Task updated successfully
 *       404:
 *         description: Task not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Only senior role can update tasks
 *
 *   delete:
 *     summary: Delete task by ID
 *     tags: [Tasks]
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
 *         description: Task deleted successfully
 *       404:
 *         description: Task not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Only senior role can delete tasks
 *
 * /api/tasks/{taskId}/subtasks/{subtaskId}:
 *   patch:
 *     summary: Toggle subtask completion status
 *     tags: [Tasks]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: subtaskId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Subtask status toggled successfully
 *       404:
 *         description: Task or subtask not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Only senior role can toggle subtasks
 *
 * /api/tasks/{taskId}/feedback:
 *   post:
 *     summary: Add feedback to a task
 *     tags: [Tasks]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - comment
 *               - author
 *             properties:
 *               comment:
 *                 type: string
 *                 description: Feedback comment text
 *               author:
 *                 type: string
 *                 description: ID of the user providing feedback
 *     responses:
 *       200:
 *         description: Feedback added successfully
 *       400:
 *         description: Invalid request - Missing taskId, comment, or author
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Only senior role can add feedback
 *       404:
 *         description: Task not found
 *       500:
 *         description: Server error while adding feedback
 *
 *   get:
 *     summary: Get all feedback for a task
 *     tags: [Tasks]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of all feedback for the task
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 feedback:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       author:
 *                         type: string
 *                         description: ID of the feedback author
 *                       comment:
 *                         type: string
 *                         description: Feedback comment text
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *       400:
 *         description: Invalid request - Missing taskId
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Task not found
 *       500:
 *         description: Server error while fetching feedback
 *
 * /api/tasks/{taskId}/feedback/{feedbackId}:
 *   delete:
 *     summary: Delete specific feedback from a task
 *     tags: [Tasks]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: feedbackId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Feedback deleted successfully
 *       400:
 *         description: Invalid request - Missing taskId or feedbackId
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Only senior role can delete feedback
 *       404:
 *         description: Task or feedback not found
 *       500:
 *         description: Server error while deleting feedback
 */
