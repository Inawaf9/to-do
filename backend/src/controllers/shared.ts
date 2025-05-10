import { Request, Response } from "express";

import { UserModel } from "../models/User";
import { ListModel } from "../models/List";
import { TaskModel } from "../models/Task";

export async function shareList(req: any, res: Response) {
    try{
        const { listId } = req.params;
        const { email } = req.body;
        const owner = req.id.id;
    

        // Check if the list exists and belongs to the owner
        const list = await ListModel.findOne({ _id: listId, owner });
        if (!list) {
            res.status(404).json({ error: "List not found" });
            return;
        }

        // Check if the user exists
        const user = await UserModel.findOne({email});
        if (!user) {
            res.status(404).json({ error: "User not found" });
            return;
        }

        // Share the list with the user
        list.sharedWith.push(user.id);
        await list.save();

        res.status(200).json({ message: "List shared successfully" });
    } catch (error) {
        res.status(500).json({ error });
    }
}

export async function addTaskToSharedList(req: any, res: Response) {
    try {
        const { title, description } = req.body;
        const { listId } = req.params;
        const owner = req.id.id;

        // Check if the list exists and is shared with the user
        const list = await ListModel.findOne({ _id: listId, sharedWith: owner });
        if (!list) {
            res.status(404).json({ error: "List not found or not shared with you" });
            return;
        }

        // Create a new task and associate it with the list
        const task = new TaskModel({ title, description, listId, createdBy: owner });
        await task.save();

        res.status(201).json(task);
    } catch (error) {
        res.status(500).json({ error });
    }
}

export async function getSharedLists(req: any, res: Response) {
    try {
        const owner = req.id.id;

        // Find lists shared with the user
        const lists = await ListModel.find({ sharedWith: owner });
        if (!lists) {
            res.status(404).json({ error: "No shared lists found" });
            return;
        }

        res.status(200).json(lists);
    } catch (error) {
        res.status(500).json({ error });
    }
}