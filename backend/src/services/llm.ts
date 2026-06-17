import { GoogleGenAI } from "@google/genai";
import { Message } from '../generated/prisma/client/index.js'

const ai =  new GoogleGenAI({});

const SYSTEM_INSTRUCTION = `You are a helpful support agent for a small e-commerce store called Spur Store. 
Answer clearly and concisely. If you don't know the answer, politely say so.
FAQ Knowledge:
- Shipping policy: We ship to the USA within 3-5 business days.
- Return/refund policy: Returns are accepted within 30 days of purchase for a full refund.
- Support hours: Monday to Friday, 9 AM to 5 PM EST.`;

export async function generateReply(history: Message[],userMessage:string):Promis<string>{

        const contents = history.map((msg)=>({
            role: msg.sender === 'user' ? 'user' : 'model',
            parts: [{text: msg.text}],
        }))
        contents.push({
            role:'user',
            parts:[{text: userMessage}],
        })

        try{
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents:contents,
                config:{
                    systemInstruction:SYSTEM_INSTRUCTION,
                    temperature:0.7,
                }
            })
            return response.text || "I'm sorry, I couldn't generate a response.";
        }catch(error){
            console.log(error)
            throw new Error("Failed to generate response from LLM")
        }
}
