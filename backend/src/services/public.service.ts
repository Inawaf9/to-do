import { v4 } from 'uuid';

import { ListModel } from '../models/List.model';
import { IUser, UserModel } from '../models/User.model';
import { TaskModel } from '../models/Task.model';
import { getList } from './list.service';


export async function publicLinkService(userId: string, listId: string, isPublic: boolean, publicPermission: 'read' | 'edit') {
  if (!userId || !listId) {
    throw new Error('User ID and List ID are required');
  }

  const list = await getList(listId, userId);

  if (!list) {
    throw new Error('List not found or you are not authorized to modify it');
  }

  list.isPublic = isPublic;
  list.publicPermission = publicPermission;

  if (isPublic && !list.publicToken) {
    list.publicToken = v4();
  } else if (!isPublic) {
    list.publicToken = '';
    list.publicPermission = 'read';
  }

  await list.save();
  return { token: list.publicToken };
}

export async function publicListService(token: string) {
  if (!token) {
    throw new Error('Token is required');
  }

  const list = await ListModel.findOne({ publicToken: token });

  if (!list) {
    throw new Error('List not found');
  }

    if (!list.isPublic) {
        throw new Error('List is not public');
    }

  return list;
}

export async function updatePublicLinkService(userId: string, listId: string, isPublic: boolean, publicPermission: 'read' | 'edit') {
  if (!userId || !listId) {
    throw new Error('User ID and List ID are required');
  }

  const list = await getList(listId, userId);

  if (!list) {
    throw new Error('List not found or you are not authorized to modify it');
  }

  list.isPublic = isPublic;
  list.publicPermission = publicPermission;

  if (isPublic && !list.publicToken) {
    list.publicToken = v4();
  } else if (!isPublic) {
    list.publicToken = '';
    list.publicPermission = 'read';
  }

  await list.save();
  return { token: list.publicToken };
}

export async function deletePublicLinkService(userId: string, listId: string) {
  if (!userId || !listId) {
    throw new Error('User ID and List ID are required');
  }

  const list = await getList(listId, userId);

  if (!list) {
    throw new Error('List not found or you are not authorized to modify it');
  }

  list.isPublic = false;
  list.publicToken = '';
  list.publicPermission = 'read';

  await list.save();
}

export async function updatePublicLinkPermissionService(userId: string, listId: string, publicPermission: 'read' | 'edit') {
  if (!userId || !listId) {
    throw new Error('User ID and List ID are required');
  }

  const list = await getList(listId, userId);

  if (!list) {
    throw new Error('List not found or you are not authorized to modify it');
  }

  if (!list.isPublic) {
    throw new Error('List is not public');
  }

  list.publicPermission = publicPermission;
  await list.save();

  return { message: 'Public permission updated' };
}


// ****************************************************************
//  Public Tasks
// ****************************************************************

export async function getPublicTasksService(token: string) {
  if (!token) {
    throw new Error('Token is required');
  }

  const list = await ListModel.findOne({ publicToken: token });

  if (!list || !list.isPublic) {
    throw new Error('List not found or you do not have permission to access it');
  }

  const tasks = await TaskModel.find({ listId: list.id });
  
  if (!tasks) {
    throw new Error('Tasks not found or you do not have permission to access them');
  }

  return tasks;
}

export async function getPublicTaskService(token: string, taskId: string) {
  if (!token || !taskId) {
    throw new Error('Token and Task ID are required');
  }

  const list = await ListModel.findOne({ publicToken: token });

  if (!list || !list.isPublic) {
    throw new Error('List not found or you do not have permission to access it');
  }

  const task = await TaskModel.findOne({ _id: taskId, listId: list.id });

  if (!task) {
    throw new Error('Task not found or you do not have permission to access it');
  }

  return task;
}

export async function createPublicTaskService(token: string, title: string, description?: string) {
  if (!token || !title) {
    throw new Error('Token and Title are required');
  }

  const list = await ListModel.findOne({ publicToken: token });

  if (!list || !list.isPublic) {
    throw new Error('List not found or you do not have permission to access it');
  }

  const task = new TaskModel({
    listId: list.id,
    title,
    description,
    completed: false,
  });

  await task.save();
  return task;
}

export async function updatePublicTaskService(token: string, taskId: string, title: string, description?: string) {
  if (!token || !taskId || !title) {
    throw new Error('Token, Task ID, and Title are required');
  }

  const list = await ListModel.findOne({ publicToken: token });

  if (!list || !list.isPublic) {
    throw new Error('List not found or you do not have permission to access it');
  }

  const task = await TaskModel.findOne({ _id: taskId, listId: list.id });

  if (!task) {
    throw new Error('Task not found or you do not have permission to access it');
  }

  task.title = title;
  task.description = description;
  await task.save();

  return task;
}

export async function updatePublicTaskStatusService(token: string, taskId: string) {
  if (!token || !taskId) {
    throw new Error('Token and Task ID are required');
  }

  const list = await ListModel.findOne({ publicToken: token });

  if (!list || !list.isPublic) {
    throw new Error('List not found or you do not have permission to access it');
  }

  const task = await TaskModel.findOne({ _id: taskId, listId: list.id });

  if (!task) {
    throw new Error('Task not found or you do not have permission to access it');
  }

  task.completed = !task.completed;
  await task.save();

  return task;
}

export async function deletePublicTaskService(token: string, taskId: string) {
  if (!token || !taskId) {
    throw new Error('Token and Task ID are required');
  }

  const list = await ListModel.findOne({ publicToken: token });

  if (!list || !list.isPublic) {
    throw new Error('List not found or you do not have permission to access it');
  }

  const task = await TaskModel.findOne({ _id: taskId, listId: list.id });

  if (!task) {
    throw new Error('Task not found or you do not have permission to access it');
  }

  await TaskModel.deleteOne({ _id: task._id });
}


