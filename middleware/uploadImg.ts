import { NextFunction,Request,Response } from "express";
import {v2 as cloudinary} from 'cloudinary';
import streamifier from 'streamifier';
// const cloudinary = require("cloudinary").v2;
// const streamifier= require("streamifier");

cloudinary.config({ 
    cloud_name: 'dzvi6lrwg', 
    api_key: '151425946157833', 
    api_secret: '19Gh7LG-vBVr7FvH2P25QBPsjfk' // Click 'View API Keys' above to copy your API secret
});
// upload bằng cách mã hoá file.buffer rồi lưu mã đấy vào cloudinary.uploader
let streamUpload=(buffer)=>{
    return new Promise((resolve,reject)=>{
        let stream= cloudinary.uploader.upload_stream((error,result)=>{
            if(result){
                resolve( result);
            } else{
                reject(error);
            }
        });
        streamifier.createReadStream(buffer).pipe(stream);
    });
}

export default async function(buffer:Buffer) {
    let url= await streamUpload(buffer);
    return url['secure_url'];
}