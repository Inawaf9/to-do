import  {ListModel}  from '../models/List';
import { UserModel } from '../models/User';

import { Request, Response } from 'express';


export async function getAllList(req: any, res: Response) {
  try {
    const owner = req.id.id;
    if (owner) {
      const list = await ListModel.find({  owner });
      if (!list) {
        res.status(404).json({ error: 'List not found' });
        return;
      }
      res.status(200).json(list);
      return;
    };
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export async function getListById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const list = await ListModel.findById(id);
    if (!list) {
      res.status(404).json({ error: 'List not found' });
      return;
    }
    res.status(200).json(list);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export async function createNewList(req: any, res: Response): Promise<void> {
  try {
    const title = req.body.title;
    const owner = req.id.id;

    const newList = new ListModel({title, owner});
    await newList.save();
    const user = await UserModel.findById(owner);
    if (!user) {
       res.status(404).json({ error: 'User not found' });
       return;
    }
    user.lists.push(newList.id);
    await user.save();
    res.status(201).json("List created successfully");
  } catch (error) {
    res.status(500).json({ error});
  }
};

export async function deleteList(req: any, res: Response) {
  try {
    const listId = req.params.id;
    const owner = req.id.id;
    const list = await ListModel.findOne({ _id: listId, owner});
    const user = await UserModel.findById(owner);

    if(!list) {
      res.status(404).json({ error: 'List not found' });
      return;
    }
    if(owner !== list.owner.toString()) {
      res.status(403).json({ error: 'You are not authorized to delete this list' });
      return;
    }
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    user.lists = user.lists.filter((listId: any) => listId.toString() !== list.id.toString());
    await user.save();
    await ListModel.deleteOne({ _id: listId });
    res.status(200).json({ message: 'List deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export async function updateList(req: any, res: Response) {
  try {
    const { id } = req.params;
    const { title } = req.body;
    const owner = req.id.id;
    const list = await ListModel.findOne({ _id: id, owner });
    if (!list) {
      res.status(404).json({ error: 'List not found' });
      return;
    }
    if (owner !== list.owner.toString()) {
      res.status(403).json({ error: 'You are not authorized to update this list' });
      return;
    }
    list.title = title;
    await list.save();
    res.status(200).json({ message: 'List updated successfully' });
    
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};