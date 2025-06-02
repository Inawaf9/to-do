import { Router } from "express";

import { getTasks, getTask, createTask, updateTask, updateTaskStatus, deleteTask } from "../controllers/task.controller";

import { TaskValidation } from "../validators/task.validator";
import { validate } from "../middleware/validate";

const router = Router();

router.get("/:listId", getTasks);
router.get("/:listId/:taskId", getTask);

router.post("/:listId", TaskValidation, validate, createTask);
router.put("/:listId/:taskId", TaskValidation, validate, updateTask);
router.patch("/:listId/:taskId/status", updateTaskStatus);
router.delete("/:listId/:taskId", deleteTask);


export default router;