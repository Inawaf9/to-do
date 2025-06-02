import asyncHandler from 'express-async-handler';

import { UserModel } from "../models/User.model";

import { getProfileService, updateProfileService, updateAvatarService, addFriendService, removeFriendService, getFriendsService } from "../services/user.service";

export const getProfile = asyncHandler(async (req: any, res: any) => {
    const userId = req.user.id;

    const user = await getProfileService(userId);

    return res.status(200).json(user);

});

export const updateProfile = asyncHandler(async (req: any, res: any) => {
   const userId = req.user.id;
   const {fullName, username} = req.body;

    await updateProfileService(userId, {fullName , username});

   return res.status(200).json("Profile updated successfully");


});

export const updateAvatar = asyncHandler(async (req: any, res: any) => {
    const userId = req.user.id;
    const {avatar} = req.file;

    const user = await updateAvatarService(userId, avatar);

    return res.status(200).json(user);
});

export const addFriend = asyncHandler(async (req: any, res: any) => {
    const userId = req.user.id;
    const {FriendUsername} = req.body;

    await addFriendService(userId, FriendUsername);

    return res.status(200).json({message: 'Friend added successfully'});

});

export const removeFriend = asyncHandler(async (req: any, res: any) => {
    const userId = req.user.id;
    const {FriendUsername} = req.body;

    await removeFriendService(userId, FriendUsername);

    return res.status(200).json({message: 'Friend removed successfully'});
});

export const getFriends = asyncHandler(async (req: any, res: any) => {
    const userId = req.user.id;

    const friends = await getFriendsService(userId);

    return res.status(200).json(friends);
});