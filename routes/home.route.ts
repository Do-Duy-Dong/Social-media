import { Router } from "express";
import * as controller from "../controller/home.controller";
import multer from "multer";
const uploads= multer();
import { upload } from "../middleware/uploadCloud";

const router:Router= Router();

router.get("/",controller.index);
router.get("/profile",controller.profile);
router.post("/profile/edit/:id",uploads.single('avatar'),upload,controller.profilePost);

export const homeRouter:Router =router;

