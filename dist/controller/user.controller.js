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
exports.logout = exports.registerPost = exports.register = exports.loginPost = exports.login = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const room_model_1 = __importDefault(require("../models/room.model"));
const md5_1 = __importDefault(require("md5"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const home_1 = require("../config/home");
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.render("pages/auth/login.ejs", {});
});
exports.login = login;
const loginPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const email = req.body.email;
        const password = (0, md5_1.default)(req.body.password);
        const user = yield user_model_1.default.findOne({
            email: email,
            password: password
        });
        if (!user) {
            res.status(400).json({ err: "email or password not existed" });
            return;
        }
        const token = jsonwebtoken_1.default.sign({ id: user._id }, process.env.ACCESS_KEY);
        res.cookie("tokenUser", token);
        yield user_model_1.default.updateOne({
            email: email,
            password: password
        }, {
            tokenUser: token
        });
        res.status(200).json({ redirect: `${(0, home_1.home)()}/home/profile` });
    }
    catch (err) {
        res.status(400).json(err);
    }
});
exports.loginPost = loginPost;
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.render("pages/auth/register.ejs", {});
});
exports.register = register;
const registerPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, fullName, password, confirmPass } = req.body;
        const user = yield user_model_1.default.findOne({ email: email });
        console.log();
        if (user || password != confirmPass) {
            res.status(400).json("Lỗi");
            return;
        }
        const record = new user_model_1.default({
            fullName: fullName,
            email: email,
            password: (0, md5_1.default)(password),
        });
        yield record.save();
        const chatBot = new room_model_1.default({
            type: "Chat Bot",
            user: {
                user_id: record._id,
                fullName: record.fullName
            }
        });
        yield chatBot.save();
        res.status(200).json({ redirect: `${(0, home_1.home)()}/user/login` });
    }
    catch (err) {
        res.status(400).json({ err: "Lỗi" });
    }
});
exports.registerPost = registerPost;
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.clearCookie('tokenUser');
    res.redirect(`${(0, home_1.home)()}/user/login`);
});
exports.logout = logout;
