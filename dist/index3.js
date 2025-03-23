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
const openai_1 = __importDefault(require("openai"));
const readline_sync_1 = __importDefault(require("readline-sync"));
require('dotenv').config();
(() => __awaiter(void 0, void 0, void 0, function* () {
    const openai = new openai_1.default({
        apiKey: process.env.API_OPENAI_KEY
    });
    const history = [];
    while (true) {
        const user_input = readline_sync_1.default.question("Your input: ");
        const messages = [];
        for (const [input_text, completion_text] of history) {
            messages.push({ role: "user", content: input_text });
            messages.push({ role: "assistant", content: completion_text });
        }
        messages.push({ role: "user", content: user_input });
        try {
            const completion = yield openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: messages,
            });
            const completion_text = completion.choices[0].message.content;
            console.log(completion_text);
            history.push([user_input, completion_text]);
            const user_input_again = readline_sync_1.default.question("\nWould you like to continue the conversation? (Y/N)");
            if (user_input_again.toUpperCase() === "N") {
                return;
            }
            else if (user_input_again.toUpperCase() !== "Y") {
                console.log("Invalid input. Please enter 'Y' or 'N'.");
                return;
            }
        }
        catch (error) {
            if (error.response) {
                console.log(error.response.status);
                console.log(error.response.data);
            }
            else {
                console.log(error.message);
            }
        }
    }
}))();
