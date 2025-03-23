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
exports.profilePost = exports.profile = exports.index = void 0;
const room_model_1 = __importDefault(require("../models/room.model"));
const user_model_1 = __importDefault(require("../models/user.model"));
const index = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const room = yield room_model_1.default.find({});
        res.render("pages/home/index", {});
    }
    catch (err) {
        res.json(err);
    }
});
exports.index = index;
const profile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.default.findOne({ tokenUser: req.cookies.tokenUser });
    res.render("pages/home/profile", {
        user: user
    });
});
exports.profile = profile;
const profilePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const object = req.body;
        const id = req.params.id;
        yield user_model_1.default.updateOne({ _id: id }, object);
        res.redirect('back');
    }
    catch (error) {
        console.log(error);
    }
});
exports.profilePost = profilePost;
