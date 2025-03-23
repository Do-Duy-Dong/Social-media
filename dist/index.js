"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const body_parser_1 = __importDefault(require("body-parser"));
const express_ejs_layouts_1 = __importDefault(require("express-ejs-layouts"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const method_override_1 = __importDefault(require("method-override"));
const char_1 = require("./function/char");
const database = __importStar(require("./config/mongoose"));
const index_route_1 = __importDefault(require("./routes/index.route"));
const socket_io_1 = require("socket.io");
const multer_1 = __importDefault(require("multer"));
const upload = (0, multer_1.default)();
const app = (0, express_1.default)();
const http_1 = __importDefault(require("http"));
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    maxHttpBufferSize: 1e8
});
global.__chat = io;
dotenv_1.default.config();
database.connect();
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use((0, method_override_1.default)("_method"));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.static(`${__dirname}/public`));
app.set("view engine", "ejs");
app.set("views", `${__dirname}/view`);
app.use(express_ejs_layouts_1.default);
app.set("layout", "layouts/layout.ejs");
app.locals.home = '/discord';
(0, index_route_1.default)(app);
(0, char_1.onlineSocket)();
(0, char_1.chatSocket)();
(0, char_1.friendSocket)();
const port = 3000;
server.listen(port, () => {
    console.log("App listen on port 3000");
});
