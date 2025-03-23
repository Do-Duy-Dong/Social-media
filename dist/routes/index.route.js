"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_route_1 = require("./user.route");
const home_route_1 = require("./home.route");
const chat_route_1 = require("./chat.route");
const social_route_1 = require("./social.route");
const home_1 = require("../config/home");
const auth_1 = __importDefault(require("../middleware/auth"));
const mainRouter = (app) => {
    app.use(`${(0, home_1.home)()}/user`, user_route_1.userRouter);
    app.use(`${(0, home_1.home)()}/home`, auth_1.default, home_route_1.homeRouter);
    app.use(`${(0, home_1.home)()}/chat`, auth_1.default, chat_route_1.chatRouter);
    app.use(`${(0, home_1.home)()}/social`, auth_1.default, social_route_1.socialRouter);
};
exports.default = mainRouter;
