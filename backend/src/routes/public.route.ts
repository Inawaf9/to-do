import { Router } from "express";


import { getPublicTasks, createPublicTask, updatePublicTask, updatePublicTaskStatus, deletePublicTask } from "../controllers/public.controller";

import { TaskValidation } from "../validators/task.validator";
import { validate } from "../middleware/validate";


const router = Router();


router.get("/:token", getPublicTasks);


router.post("/:token/new", TaskValidation, validate, createPublicTask);
router.put("/:token/:taskId", TaskValidation, validate, updatePublicTask);
router.patch("/:token/:taskId/status", updatePublicTaskStatus);
router.delete("/:token/:taskId", deletePublicTask);

export default router;