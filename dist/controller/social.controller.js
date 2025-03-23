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
exports.call = exports.onlineFriend = exports.addFriend = exports.friendPend = exports.friend = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const friend = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const record = yield user_model_1.default.findOne({ tokenUser: req.cookies.tokenUser }).select("friendList");
    const ids = record.friendList;
    const users = yield user_model_1.default.find({ _id: { $in: ids } }).select("id fullName avatar");
    res.render("pages/chat/friend.ejs", {
        users: users
    });
});
exports.friend = friend;
const friendPend = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.default.findOne({ tokenUser: req.cookies.tokenUser }).select("requestedF");
    const ids = user.requestedF.map(obj => obj.user_id);
    const users = yield user_model_1.default.find({ _id: { $in: ids } }).select("id fullName avatar");
    res.render("pages/chat/friendPend.ejs", {
        record: users
    });
});
exports.friendPend = friendPend;
const addFriend = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var find = [];
    const user = yield user_model_1.default.findOne({ tokenUser: req.cookies.tokenUser }).select("friendList sendReqF requestedF");
    if (req.query.keyword) {
        let res = req.query.keyword.toLocaleString();
        const reg = new RegExp(res, "i");
        var users = yield user_model_1.default.find({ fullName: reg }).select("_id fullName").lean();
        const arr1 = user.friendList;
        const arr2 = user.requestedF.map(item => item.user_id);
        const arr3 = user.sendReqF.map(item => item.user_id);
        const arr4 = [...new Set([...arr1, ...arr2, ...arr3])];
        const arr5 = users.filter(item => !arr4.includes(item._id.toString()));
        find = arr5;
        console.log(arr5);
    }
    res.render("pages/chat/addFriend.ejs", {
        record: find
    });
});
exports.addFriend = addFriend;
const onlineFriend = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.render("pages/chat/onlineFr.ejs", {});
});
exports.onlineFriend = onlineFriend;
const call = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
});
exports.call = call;
