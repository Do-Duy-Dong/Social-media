import mongoose from 'mongoose';
export const connect= async (): Promise<void> =>{
    try {
        await mongoose.connect(process.env.mongoose_URL);
        console.log("Connected");
    } catch (error) {
        console.log(error);
        console.log("Error")
    }
}