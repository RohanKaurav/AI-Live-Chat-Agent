import {prisma } from '../db/client.js';
import type { Prisma } from '../generated/prisma/client/index.js';
import { config } from '../config/index.js'

export async function createConversation(){
    return prisma.conversation.create({
        data:{},
    });
}

export async function getConversationHistory(conversationId: string){
    try{
            const messages =  await prisma.message.findMany({
                where:{
                    conversationId
                },
                orderBy:{
                    createdAt:'desc'
                },  
                take:config.MAX_HISTORY_MESSAGES,
            })

            return messages.reverse();
    }catch(error){
        console.error("Error fetching conversation history", error);
        throw error;
    }
}

export async function saveMessage(conversationId:string, sender: 'user' | 'ai', text:string){
    try{
        return await prisma.message.create({
            data:{
                conversationId,
                sender,
                text,
            },
        });
    }catch(error){
        console.error("Error saving message", error);
        throw error;
    }
}