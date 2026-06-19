import { GoogleGenAI } from "@google/genai";
import { type Message } from '../generated/prisma/client/index.js'
import { config } from '../config/index.ts';

const ai =  new GoogleGenAI({});



export async function generateReply(history: Message[],userMessage:string):Promise<string>{

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
                    systemInstruction:config.SYSTEM_INSTRUCTION,
                    temperature:0.7,
                    maxOutputTokens: config.MAX_OUTPUT_TOKENS,
                }
            })
            return response.text || "I'm sorry, I couldn't generate a response.";
        }catch(error){
            console.log(error)
            throw new Error("Failed to generate response from LLM")
        }
}
