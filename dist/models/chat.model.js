"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const chatSchema = new mongoose_1.default.Schema({
    sender: String,
    myName: String,
    room_chat_id: String,
    content: String,
    images: {
        type: [String]
    },
    read: {
        type: Boolean,
        default: false
    },
    deleted: {
        type: Boolean,
        default: false
    },
    deletedAt: Date,
}, {
    timestamps: true
});
const Chat = mongoose_1.default.model("Chat", chatSchema, "Chat");
exports.default = Chat;
