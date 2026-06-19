import axios from "axios";

const API_URL = import.meta.env.BACKEND_URL || 'http://localhost:3001';

export async function sendMessage(message:string, sessionId?:string){
        try{
            const response = await axios.post(`${API_URL}/chat/message`, 
                {message, sessionId}
            )
            return response.data;
        }catch(error){
            console.error("Error sending Message", error);
            throw new Error("Failed to send message");
        }
}

