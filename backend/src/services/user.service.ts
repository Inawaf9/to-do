import { UserModel } from '../models/User.model';

export async function getProfileService(userId: string){

    const user = await UserModel.findById(userId, {password: 0}).populate("friends", {password: 0});

    if(!user) throw new Error('User not found')

    return user;
}

export async function updateProfileService(userId: string, data: object){
    const user = await UserModel.findByIdAndUpdate(userId, data);

    if(!user) throw new Error('User not found')

    return user;

}

export async function updateAvatarService(userId: string, data: object){
    const user = await UserModel.findByIdAndUpdate(userId, data);

    if(!user) throw new Error('User not found')

}

export async function addFriendService(userId: string, FriendUsername: string){
    const user = await UserModel.findById(userId);

    if(!user) throw new Error('User not found')

    const friend = await UserModel.findOne({username: FriendUsername});

    if(!friend) throw new Error('Friend not found');

    if(user.friends.includes(friend.id)) throw new Error('Friend already added');

    user.friends.push(friend.id);
    friend.friends.push(user.id);

    await user.save();
    await friend.save();
}

export async function removeFriendService(userId: string, FriendUsername: string){
    const user = await UserModel.findById(userId);

    if(!user) throw new Error('User not found');

    const friend = await UserModel.findOne({username: FriendUsername});

    if(!friend) throw new Error('Friend not found');

    if(!user.friends.includes(friend.id)) throw new Error('User is not friend');

    user.friends = user.friends.filter((u) => u.toString() !== friend.id.toString());
    friend.friends = friend.friends.filter((f) => f.toString() !== user.id.toString());


    await user.save();
    await friend.save();
}

export async function getFriendsService(userId: string){
    const user = await UserModel.findById(userId, {friends: 1}).populate("friends", {username: 1, avatar: 1});

    if(!user) throw new Error('User not found');

    if(user.friends === null) throw new Error('Friends not found')

    return user.friends;
}