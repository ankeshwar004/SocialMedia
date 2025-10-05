import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv/config';
import cors from 'cors'; 
import connectDB from './config/db.js';
import { inngest, functions } from "./inngest/index.js"
import { serve } from "inngest/express";


const app = express();
connectDB();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use("/api/inngest", serve({ client: inngest, functions }));


app.get('/', (req, res) => {
  res.send('API is running...');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});