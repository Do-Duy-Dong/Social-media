import mongoose from "mongoose";
const SocialModel= new mongoose.Schema({
    title:String
});
const Social= mongoose.model("Social",SocialModel,"Social");
export default Social;