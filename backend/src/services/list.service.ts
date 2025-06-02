import { ListModel } from '../models/List.model';
import { IUser, UserModel } from '../models/User.model';

import { sendEmail } from '../services/email.service';

import { v4 } from 'uuid';


export async function getUser(user: object) {

  if (!user) {
    throw new Error('User is required');
  }

  const existingUser = await UserModel.findOne(user, {password: 0});
  
  if (!existingUser) {
    throw new Error('User not found');
  }
  
  console.log(existingUser)
  return existingUser;
}

export async function getAllLists(user: object) {
  const existingUser = await getUser(user);

const lists = await ListModel.find({ $or: [{ owner: existingUser?._id }, { sharedWith: { $elemMatch: { userId: existingUser?._id } } }] })
  .populate<{ owner: IUser }>('owner', '_id email username')
  .populate<{ 'sharedWith.userId': IUser }>('sharedWith.userId', '_id email username');
  if(!lists){
    throw new Error('List not found');
  };

  return lists;
}

export async function getList(listId: string, userId: string) {
  if (!listId || !userId) {
    throw new Error('List ID and User ID are required');
  }

  const list = await ListModel.findById({ _id: listId })
    .populate<{ owner: IUser }>('owner', '_id email username')
    .populate<{ 'sharedWith.userId': IUser }>('sharedWith.userId', '_id email username');

    console.log(list, );

  if (!list) {
    throw new Error('List not found');
  }

  // if (list.owner.toString() !== userId || !list.sharedWith.some((sharedUser: any) => sharedUser.userId.toString() === userId)) {
  //   throw new Error('User is not authorized to access this list');
  // }

  return list;
}

export async function createList(userId: object, title: string) {

  const user = await getUser(userId);

  const newList = new ListModel({ title, owner: user?._id });
  await newList.save();

  user?.lists.push(newList.id);
  await user?.save();
}

export async function removeList(userId: string, listId: string) {
  if (!userId || !listId) {
    throw new Error('User ID and List ID are required');
  }
  const list = await ListModel.findOneAndDelete({ _id: listId, owner: userId });
  if (!list) {
    throw new Error('List not found or you are not authorized to delete it');
  }
}

export async function updateListService(userId: string, listId: string, title: string) {
  if (!userId || !listId || !title) {
    throw new Error('User ID, List ID, and title are required');
  }
  const list = await ListModel.findOne({ _id: listId, owner: userId });
  if (!list) {
    throw new Error('List not found or you are not authorized to update it');
  }
  list.title = title;
  await list.save();

  return list;
}

export async function shareListService(userId: string, listId: string, email: string, permission: "read" | "edit") {
  if (!userId || !listId || !email || !permission) {
    throw new Error('User ID, List ID, email, and permission are required');
  }
  
  const list = await ListModel.findOne({ _id: listId, owner: userId })
  .populate<{ owner: IUser }>('owner', 'email username')
  .populate<{ 'sharedWith.userId': IUser }>('sharedWith.userId', 'email username');

  if (!list) {
    throw new Error('List not found or you are not authorized to share it');
  }

  const user = await UserModel.findOne({ email });
  if (!user) {
    throw new Error('User not found');
  }

  if (list.sharedWith.some((sharedUser: any) => sharedUser.userId.toString() === user.id.toString())) {
    throw new Error('User already has access to this list');
  }

  list.sharedWith.push({ userId: user.id, permission });
  await list.save();
  sendEmail('ToDo <todo@nawafalghamdi.com>', email, `Shared List from ${list.owner.username}`, `<p>You has invited in the new list from ${list.owner.email}<p/>`);

  return list;
}


export async function updateSharePermissionService(userId: string, listId: string, email: string, permission: "read" | "edit") {
  if (!userId || !listId || !email || !permission) {
    throw new Error('User ID, List ID, email, and permission are required');
  }
  const list = await ListModel.findOne({ _id: listId, owner: userId });
  if (!list) {
    throw new Error('List not found or you are not authorized to update it');
  }
  const user = await UserModel.findOne({ email });
  if (!user) {
    throw new Error('User not found');
  }

  const sharedUser = list.sharedWith.find((sharedUser: any) => sharedUser.userId.toString() === user.id.toString());
  if (!sharedUser) {
    throw new Error('User does not have access to this list');
  }
  
  sharedUser.permission = permission;
  await list.save();

  return list;
}
export async function unshareListService(userId: string, listId: string, email: string) {
  if (!userId || !listId || !email) {
    throw new Error('User ID, List ID, and email are required');
  }
  const list = await ListModel.findOne({ _id: listId, owner: userId });
  if (!list) {
    throw new Error('List not found or you are not authorized to unshare it');
  }
  const user = await UserModel.findOne({ email });
  if (!user) {
    throw new Error('User not found');
  }
  list.sharedWith = list.sharedWith.filter((sharedUser: any) => sharedUser.userId.toString() !== user.id.toString());
  await list.save();
  return list;
}