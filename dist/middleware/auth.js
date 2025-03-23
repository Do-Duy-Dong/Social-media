"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
const user_model_1 = __importDefault(require("../models/user.model"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const room_model_1 = __importDefault(require("../models/room.model"));
const home_1 = require("../config/home");
function default_1(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const token = req.cookies.tokenUser;
            const check = jsonwebtoken_1.default.verify(token, process.env.ACCESS_KEY);
            const user = yield user_model_1.default.findOne({ tokenUser: token }).select("-password");
            const rooms = yield room_model_1.default.find({
                status: 'Already',
                "user.user_id": user._id
            }).lean();
            const arr = rooms.map(item => item['user'].find(record => record.user_id != user._id).user_id);
            const users = yield user_model_1.default.find({ _id: { $in: arr } }).select("fullName avatar").lean();
            users.forEach((item, index) => {
                item['room_id'] = rooms[index]['_id'].toString();
            });
            const chatBot = yield room_model_1.default.findOne({ type: 'Chat Bot', 'user.user_id': user._id });
            res.locals.chatBot = chatBot;
            res.locals.user = user;
            res.locals.room = users;
            next();
        }
        catch (err) {
            res.redirect(`${(0, home_1.home)()}/user/login`);
        }
    });
}
