"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    fullName: String,
    email: String,
    password: String,
    phone: String,
    avatar: String,
    tokenUser: {
        type: String,
    },
    friendList: {
        type: [String],
        default: []
    },
    requestedF: [
        {
            user_id: String,
        }
    ],
    sendReqF: [{
            user_id: String
        }]
}, {
    timestamps: true
});
const User = mongoose_1.default.model("User", userSchema, "User");
exports.default = User;
