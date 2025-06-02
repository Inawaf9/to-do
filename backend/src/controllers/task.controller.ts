import asyncHandler from 'express-async-handler';

import { getTasksService, getTaskService, createTaskService, updateTaskService, deleteTaskService, updateTaskStatusService } from "../services/task.service";



export const getTasks = asyncHandler(async (req: any, res: any) => {
  const userId = req.user.id;
  const listId = req.params.listId;

  const tasks = await getTasksService(userId, listId);

  return res.status(200).json(tasks);
});

export const getTask = asyncHandler(async (req: any, res: any) => {
    const taskId = req.params.taskId;
    const listId = req.params.listId;

    const task = await getTaskService(req.user.id, listId, taskId);

    return res.status(200).json(task);
});

export const createTask = asyncHandler(async (req: any, res: any) => {
    const { title, description } = req.body;

    const newTask = await createTaskService(req.user.id, req.params.listId, title, description);

    res.status(201).json(newTask);
});

export const updateTask = asyncHandler(async (req: any, res: any) => {

    const { title, description } = req.body;
    const taskId = req.params.taskId;

    const updatedTask = await updateTaskService(req.user.id, req.params.listId, taskId, title, description);

    res.status(200).json(updatedTask);
});

export const deleteTask = asyncHandler(async (req: any, res: any) => {
  const taskId = req.params.taskId;
  const listId = req.params.listId;

  await deleteTaskService(req.user.id, listId, taskId);

  res.status(200).json({ message: "Task deleted successfully" });
});

export const updateTaskStatus = asyncHandler(async (req: any, res: any) => {
  const taskId = req.params.taskId;
  const listId = req.params.listId;

  const updatedTask = await updateTaskStatusService(req.user.id, listId, taskId);

  res.status(200).json(updatedTask);
})