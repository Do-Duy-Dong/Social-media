import express,{Express,Request,Response} from "express";
import dotenv from "dotenv"; 
import bodyParser from "body-parser";
import expressLayouts from "express-ejs-layouts";
import session from "express-session";
import cookieParser from "cookie-parser"
import Social from "./models/social.model";
import methodOverride from "method-override";
import { chatSocket,friendSocket,onlineSocket,callSocket } from "./function/char";
import * as database from "./config/mongoose";
import mainRouter from "./routes/index.route";
import { Server } from "socket.io";
import multer from 'multer';
const upload=multer();
const app:Express = express();
// set up socket
import http from "http"; 
import { call } from "./controller/social.controller";


const server= http.createServer(app);
const io= new Server(server,{
    maxHttpBufferSize: 1e8 // 100 MB
});
global.__chat=io;

dotenv.config();
database.connect();


// app.use(session({
//     secret:"keyboard cat",
//     resave: false,
//     saveUninitialized:true,
//     cookie:{
//         secure: false,
//         maxAge: null
//     }
// }))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}));
app.use(methodOverride("_method"));
app.use(cookieParser());



app.use(express.static("public"));
app.set("view engine","ejs");
app.set("views",`${__dirname}/view`);
app.use(expressLayouts);

app.set("layout","layouts/layout.ejs");
app.locals.home= '/discord';
mainRouter(app);

// chatSocket();
onlineSocket();
chatSocket();
friendSocket();

// callSocket();
const port= 3000;

server.listen(port,()=>{
    console.log("App listen on port 3000");
})