import asyncHandler from 'express-async-handler';

import { getAllLists, createList, removeList, updateListService, shareListService, updateSharePermissionService, unshareListService } from '../services/list.service';



export const lists = asyncHandler(async (req: any, res: any) => {
  const user = {
    _id: req.user.id,
  };
  const lists = await getAllLists(user);

  res.status(200).json(lists);
});

export const newList = asyncHandler(async (req: any, res: any) => {
  await createList(req.user.id, req.body.title);
  res.status(201).json("List created successfully");
});

export const deleteList = asyncHandler(async (req: any, res: any) => {
  await removeList(req.user.id, req.params.id);

  res.status(200).json({ message: 'List deleted successfully' });
});

export const updateList = asyncHandler(async (req: any, res: any) => {

  const list = await updateListService(req.user.id, req.params.id, req.body.title);

  res.status(200).json({ message: 'List updated successfully', list });
});

export const shareList = asyncHandler(async (req: any, res: any) => {
  const { email, permission } = req.body;

  const list = await shareListService(req.user.id, req.params.id, email, permission);
  res.status(200).json({ message: 'List shared successfully to ', list, email });
});

export const updateSharePermission = asyncHandler(async (req: any, res: any) => {
  const { email, permission } = req.body;

  const list = await updateSharePermissionService(req.user.id, req.params.id, email, permission);
  res.status(200).json({ message: 'Permission updated successfully', list, email });
});

export const unshareList = asyncHandler(async (req: any, res: any) => {
  const { email } = req.body;

  await unshareListService(req.user.id, req.params.id, email);

  res.status(200).json({ message: 'List unshared successfully' });
});
