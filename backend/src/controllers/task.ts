import { Request, Response } from "express";

import { TaskModel } from "../models/Task";
import { ListModel } from "../models/List";

export async function getTasks(req: any, res: Response) {
  try {
    const owner = req.id.id;
    const listId = req.params.listId;
    const tasks = await TaskModel.find({ listId });
    const list = await ListModel.findOne({ _id: listId });
    if (!list) {
      res.status(404).json({ error: "List not found" });
      return;
    }
    if(owner !== list?.owner.toString() && !list.sharedWith.includes(owner)){
      res.status(403).json({ error: "You are not authorized to view tasks for this list" });
      return;
    }
    if (!tasks) {
      res.status(404).json({ error: "Tasks not found" });
      return;
    }
    if (tasks.length === 0) {
      res.status(404).json({ error: "No tasks found" });
      return;
    }
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error });
  }
};

export async function createTask(req: any, res: Response) {
  try {
    const { title, description} = req.body;
    const listId = req.params.listId;
    const owner = req.id.id;
    const list = await ListModel.findOne({ _id: listId, owner });
    if (!list) {
      res.status(404).json({ error: "List not found" });
      return;
    }
    if(owner !== list?.owner.toString()){
      res.status(403).json({ error: "You are not authorized to create tasks for this list" });
      return;
    }
    const newTask = new TaskModel({ title, description, listId, completed: false, createdBy: owner });
    await newTask.save();
    res.status(201).json(newTask);
    return;
  } catch (error) {
    res.status(500).json({ error });
  }
};

export async function updateTask(req: any, res: Response) {

  try {
    const { title, description, completed } = req.body;
    const taskId = req.params.taskId;
    const listId = req.params.listId;
    const owner = req.id.id;
    const task = await TaskModel.findOne({ _id: taskId, });
    const list = await ListModel.findOne({ _id: listId, owner });
    if (!list) {
      res.status(404).json({ error: "List not found" });
      return;
    }
    if(owner !== list?.owner.toString()){
      res.status(403).json({ error: "You are not authorized to update tasks for this list" });
      return;
    }
    if (!task) {
      res.status(404).json({ error: "Task not found" });
      return;
    }
    task.title = title;
    task.description = description;
    task.completed = completed;
    await task.save();
    res.status(200).json(task);
    return;
  } catch (error) {
    res.status(500).json({ error });
  }
};

export async function deleteTask(req: any, res: Response) {
  try {
    const taskId = req.params.taskId;
    const listId = req.params.listId;
    const owner = req.id.id;
    const task = await TaskModel.findOne({ _id: taskId });
    const list = await ListModel.findOne({ _id: listId, owner });
    if (!list) {
      res.status(404).json({ error: "List not found" });
      return;
    }
    if(owner !== list?.owner.toString()){
      res.status(403).json({ error: "You are not authorized to delete tasks for this list" });
      return;
    }
    if (!task) {
      res.status(404).json({ error: "Task not found" });
      return;
    }
    await TaskModel.deleteOne({ _id: taskId });
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ error });
  }
};