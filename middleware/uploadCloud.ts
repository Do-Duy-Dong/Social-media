import {v2 as cloudinary} from 'cloudinary';
import { NextFunction,Request,Response } from 'express';
import streamifier from 'streamifier';

cloudinary.config({ 
    cloud_name: 'dzvi6lrwg', 
    api_key: '151425946157833', 
    api_secret: '19Gh7LG-vBVr7FvH2P25QBPsjfk' // Click 'View API Keys' above to copy your API secret
});
// upload bằng cách mã hoá file.buffer rồi lưu mã đấy vào cloudinary.uploader
export const upload=(req:Request,res:Response,next:NextFunction)=>{
    if(req.file){
    let streamUpload=(req)=>{
        return new Promise((resolve,reject)=>{
            let stream= cloudinary.uploader.upload_stream((error,result)=>{
                if(result){
                    resolve( result);
                } else{
                    reject(error);
                }
            });
            streamifier.createReadStream(req.file.buffer).pipe(stream);
        });
    }
    async function upload(req){
        let result=await streamUpload(req);
        req.body[req.file.fieldname]=result['url'];
        next();
    }
    upload(req);
}
    else{
        next();
    }
}