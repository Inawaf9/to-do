import asyncHandler from "express-async-handler";

import { publicLinkService, updatePublicLinkService, deletePublicLinkService, updatePublicLinkPermissionService, publicListService
, getPublicTasksService, getPublicTaskService, createPublicTaskService, updatePublicTaskService, deletePublicTaskService, updatePublicTaskStatusService } from "../services/public.service";



// ****************************************************************
//  Public List
// ****************************************************************

export const publicLink = asyncHandler(async (req: any, res: any) => {
  const {isPublic, publicPermission } = req.body;

  const token = await publicLinkService(req.user.id, req.params.listId, isPublic, publicPermission);

  if(!token) return;

  res.json({ message: 'Public settings updated', token });
});

export const publicList = asyncHandler(async (req: any, res: any) => {
  const { token } = req.params;

  const list = await publicListService(token);

  res.status(200).json(list);
});

export const updatePublicLink = asyncHandler(async (req: any, res: any) => {
  const { isPublic, publicPermission } = req.body;

  const token = await updatePublicLinkService(req.user.id, req.params.listId, isPublic, publicPermission);

  if(!token) return;

    res.status(200).json({ message: 'Public link updated successfully', token });
});

export const deletePublicLink = asyncHandler(async (req: any, res: any) => {
    const userId = req.user.id;
    const listId = req.params.listId;


  await deletePublicLinkService(userId, listId);

    res.status(200).json({ message: 'Public link deleted successfully' });
});

export const updatePublicLinkPermission = asyncHandler(async (req: any, res: any) => {
    const { publicPermission } = req.body;

    await updatePublicLinkPermissionService(req.user.id, req.params.listId, publicPermission);

    res.status(200).json({ message: 'Public permission updated successfully' });
});


// ****************************************************************
//  Public Tasks
// ****************************************************************

export const getPublicTasks = asyncHandler(async (req: any, res: any) => {
  const { token } = req.params;

  const tasks = await getPublicTasksService(token);

  return res.status(200).json(tasks);
});

export const getPublicTask = asyncHandler(async (req: any, res: any) => {
  const { token, taskId } = req.params;

  const task = await getPublicTaskService(token, taskId);

  return res.status(200).json(task);
});

export const createPublicTask = asyncHandler(async (req: any, res: any) => {
  const { token } = req.params;
  const { title, description } = req.body;

  const newTask = await createPublicTaskService(token, title, description);

  res.status(201).json(newTask);
});

export const updatePublicTask = asyncHandler(async (req: any, res: any) => {
  const { token, taskId } = req.params;
  const { title, description } = req.body;

  const updatedTask = await updatePublicTaskService(token, taskId, title, description);

  res.status(200).json(updatedTask);
});

export const deletePublicTask = asyncHandler(async (req: any, res: any) => {
  const { token, taskId } = req.params;

  await deletePublicTaskService(token, taskId);

  res.status(200).json({ message: 'Task deleted successfully' });
});

export const updatePublicTaskStatus = asyncHandler(async (req: any, res: any) => {
  const { token, taskId } = req.params;
  const { completed } = req.body;

  const updatedTask = await updatePublicTaskStatusService(token, taskId);

  res.status(200).json(updatedTask);
});