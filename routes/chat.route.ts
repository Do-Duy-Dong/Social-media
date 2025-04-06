import { Request,Response,Router } from "express";
import multer from 'multer';
const uploads= multer();
import * as controller from "../controller/communicate.controller";
import { upload } from "../middleware/uploadCloud";
import chatRoomMiddle from "../middleware/groupChat";
import friendChatMiddle from "../middleware/friendChat"
const router:Router= Router();


router.get("/roomChat/:id",friendChatMiddle,controller.index);
router.post("/updateUnread",controller.updateUnread)
router.post("/getRoomChat",controller.getRoom);
router.get("/chatbot/:id",friendChatMiddle,controller.chatBot);
router.get("/groupChat",chatRoomMiddle,controller.groupChat);
router.post("/groupChat",uploads.single('avatar'),upload,controller.groupChatPost);
router.get('/groupChat/:id',chatRoomMiddle,friendChatMiddle,controller.chatRoom);
router.post('/outGroup/',controller.outGroup);

export const chatRouter= router;