import { ListModel } from '../models/List.model';
import { TaskModel } from '../models/Task.model';

export async function getTasksService(userId: string, listId: string) {
    const tasks = await TaskModel.find({ listId }).sort({ createdAt: -1 }).populate('createdBy', 'name email');

    if (!tasks) {
        throw new Error('No tasks found for this list');
    }
    return tasks;
}


export async function getTaskService(userId: string, listId: string, taskId: string) {
    const task = await TaskModel.findOne({ _id: taskId, listId }).populate('createdBy', 'name email');
    if (!task) {
        throw new Error('Task not found');
    }
    return task;
}

export async function createTaskService(userId: string, listId: string, title: string, description: string) {
    const list = await ListModel.findOne({ _id: listId, owner: userId });
    if (!list) {
        throw new Error('List not found or you do not have access to it');
    }

    const newTask = new TaskModel({
        title,
        description,
        listId,
        completed: false,
        createdBy: userId
    });

    await newTask.save();
    return newTask;
};

export async function updateTaskService(userId: string, listId: string, taskId: string, title: string, description: string) {
    const task = await TaskModel.findOne({ _id: taskId, listId });
    if (!task) {
        throw new Error('Task not found');
    }

    task.title = title;
    task.description = description;
    await task.save();
    return task;
}
export async function updateTaskStatusService(userId: string, listId: string, taskId: string) {
    const task = await TaskModel.findOne({ _id: taskId, listId });
    if (!task) {
        throw new Error('Task not found');
    }
    task.completed = !task.completed;
    await task.save();
    return task;
}
export async function deleteTaskService(userId: string, listId: string, taskId: string) {
    const task = await TaskModel.findOneAndDelete({ _id: taskId, listId });
    if (!task) {
        throw new Error('Task not found');
    }
}