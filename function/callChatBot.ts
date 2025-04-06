import axios from "axios";

const API_TOKEN= process.env.HUGGINGFACE_API;
const API_URL= "https://api-inference.huggingface.co/models/mistralai/Mixtral-8x7B-Instruct-v0.1" ;
export default async function callHuggingFaceAPI(history) {
    try {
        const response = await axios.post(API_URL, {
            
            inputs: history, // Định dạng như hội thoại
            parameters: {
                max_length: 23,
                temperature: 0.7,
                return_full_text: false // Chỉ lấy phần Assistant trả về
            }
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.HUGGINGFACE_API}`,
                'Content-Type': 'application/json'
            }
        });
        const requestData=response.data[0].generated_text.trim();
        // history+=` ${requestData}\n`;
        return requestData;
    } catch (error) {
        console.error('Lỗi:', error.response ? error.response.data : error.message);
        return 'Có lỗi xảy ra!';
    }
}