import { Router } from "express";

import { getProfile, updateProfile, addFriend, updateAvatar, removeFriend, getFriends} from "../controllers/user.controller";

const router = Router();

router.get("/", getProfile);
router.put("/", updateProfile);
router.patch("/avatar", updateAvatar);

router.get("/friends", getFriends);
router.put("/friends", addFriend);
router.delete("/friends", removeFriend);

export default router;