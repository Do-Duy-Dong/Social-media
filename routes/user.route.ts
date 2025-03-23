import {Router} from "express";
const router: Router=Router();
import * as controller from "../controller/user.controller";


router.get("/login",controller.login);
router.post("/login",controller.loginPost);
router.get("/register",controller.register);
router.post("/register",controller.registerPost);
router.get("/logout",controller.logout);

export const userRouter:Router =router;