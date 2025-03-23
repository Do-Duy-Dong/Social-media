"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const roomSchema = new mongoose_1.default.Schema({
    roomName: String,
    avatar: String,
    type: String,
    user: [
        {
            user_id: String,
            fullName: String
        }
    ],
    status: {
        type: String,
        enum: ['Already', 'Not']
    }
}, {
    timestamps: true
});
const room = mongoose_1.default.model("room", roomSchema, "room");
exports.default = room;
