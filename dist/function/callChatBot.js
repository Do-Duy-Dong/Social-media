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
exports.default = callHuggingFaceAPI;
const axios_1 = __importDefault(require("axios"));
const API_TOKEN = process.env.HUGGINGFACE_API;
const API_URL = "https://api-inference.huggingface.co/models/mistralai/Mixtral-8x7B-Instruct-v0.1";
function callHuggingFaceAPI(history) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield axios_1.default.post(API_URL, {
                inputs: history,
                parameters: {
                    max_length: 23,
                    temperature: 0.7,
                    return_full_text: false
                }
            }, {
                headers: {
                    'Authorization': `Bearer ${API_TOKEN}`,
                    'Content-Type': 'application/json'
                }
            });
            const requestData = response.data[0].generated_text.trim();
            return requestData;
        }
        catch (error) {
            console.error('Lỗi:', error.response ? error.response.data : error.message);
            return 'Có lỗi xảy ra!';
        }
    });
}
