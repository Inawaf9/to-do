import { Router } from "express";
import { getTasks, createTask, updateTask, deleteTask } from "../controllers/task";

const router = Router();

router.get("/:listId", getTasks);
router.post("/:listId/new", createTask);
router.put("/:listId/:taskId", updateTask);
router.delete("/:listId/:taskId", deleteTask);


export default router;