import {userRouter} from "./user.route";
import { homeRouter } from "./home.route";
import { chatRouter } from "./chat.route";
import { Express } from "express";
import { socialRouter } from "./social.route";
import { home } from "../config/home";
import authMiddleware from "../middleware/auth";
const mainRouter=(app:Express)=>{
    app.use(`${home()}/user`,userRouter);
    
    app.use(`${home()}/home`,authMiddleware,homeRouter);
    app.use(`${home()}/chat`,authMiddleware,chatRouter);
    app.use(`${home()}/social`,authMiddleware,socialRouter);
}
export default mainRouter;