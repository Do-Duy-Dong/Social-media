import { Request,Response,Router } from "express";
import multer from 'multer';
const uploads= multer();
import * as controller from "../controller/communicate.controller";
import { upload } from "../middleware/uploadCloud";
const router:Router= Router();
router.get("/roomChat/:id",controller.index);
router.post("/getRoomChat",controller.getRoom);

router.get("/chatbot/:id",controller.chatBot);
router.get("/groupChat",controller.groupChat);
router.post("/groupChat",uploads.single('avatar'),upload,controller.groupChatPost);
router.get('/groupChat/:id',controller.chatRoom);
router.post('/outGroup/',controller.outGroup);

export const chatRouter= router;