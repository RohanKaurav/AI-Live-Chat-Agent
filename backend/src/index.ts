import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import { chatRouter } from './routes/chat.js';

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/chat',chatRouter);

app.get('/health',(req,res)=>{
    res.json({status:'ok'});
})

app.listen(port,()=>{
    console.log(`Backend is running on http://localhost:${port}`);
})