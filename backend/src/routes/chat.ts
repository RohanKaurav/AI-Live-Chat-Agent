import {Router, type Request, type Response} from 'express';
import { createConversation, getConversationHistory, saveMessage } from '../services/conversation.js';
import { generateReply } from '../services/llm.js';
import { config } from '../config/index.ts';
const chatRouter = Router();

chatRouter.post('/message', async (req:Request, res:Response): Promise<void> =>{
    try{
        const { message, sessionId } = req.body;
        if(!message || typeof message !== 'string'){
             res.status(400).json({error: 'Message is required, it cannot be empty'});
             return;
        }

            if (message.length > config.MAX_MESSAGE_LENGTH) {
             res.status(400).json({ error: `Message too long. Max ${config.MAX_MESSAGE_LENGTH} characters.` });
             return;
        }

        let conversationId = sessionId;
        if(!conversationId){
            const newConv = await createConversation();
            conversationId = newConv.id;
            
        }

        const history = await getConversationHistory(conversationId);

        await saveMessage(conversationId,'user',message);

        const aiReplyText = await generateReply(history,message);

        await saveMessage(conversationId,'ai', aiReplyText);

        res.status(200).json({ 
            success: true, 
            message: "Message processed successfully",
            reply: aiReplyText,
            sessionId: conversationId
        });
        
        
    }catch(error){
        console.error('Error in sending messages:', error);
        res.status(500).json({ error: 'Internal server error. Please try again later.' });
    }

});

chatRouter.get('/history/:sessionId', async (req: Request, res: Response): Promise<void> => {
    try {
        const { sessionId } = req.params;
        if(!sessionId || typeof sessionId !== 'string'){
            res.status(400).json({ error: 'Session ID is required and must be a string.' });
            return;
        }
        const history = await getConversationHistory(sessionId); 
        res.status(200).json({ history });
    } catch (error) {
        console.error('Error fetching history:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
});


export { chatRouter };
