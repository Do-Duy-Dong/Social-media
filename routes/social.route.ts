import {Router} from "express";
const router: Router=Router();
import * as controller from "../controller/social.controller";


router.get("/friends",controller.friend);
// router.get("/friends/online",controller.friendOnl);
router.get("/friends/pending",controller.friendPend);
router.get("/friends/addFriend",controller.addFriend);
router.get("/friends/online",controller.onlineFriend);


export const socialRouter:Router =router;