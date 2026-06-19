import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import { chatRouter } from './routes/chat.ts';

const app = express();
const port = process.env.PORT || 3001;

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));


app.use(express.json());

app.use('/chat',chatRouter);

app.get('/health',(req,res)=>{
    res.json({status:'ok'});
})

app.listen(port,()=>{
    console.log(`Backend is running on http://localhost:${port}`);
})