import path from 'path';
import express from 'express';
import { app, server } from './socket/socket.js';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.routes.js';
import messageRoutes from './routes/message.routes.js';
import userRoutes from './routes/user.routes.js';
import connectToMongoDB from './database/connectToMdb.js';

// Load environment variables from .env
dotenv.config();

app.set('trust proxy', 1);

const PORT_URL = process.env.PORT || 5000;
const __dirname = path.resolve();

// Use environment variable if provided, otherwise default to Docker Compose Mongo
const MONGO_URI = process.env.MONGO_URI || 'mongodb://mongo:27017/chatdb';

// Connect to MongoDB
connectToMongoDB(MONGO_URI);

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/users', userRoutes);

// Serve frontend
app.use(express.static(path.join(__dirname, '/client/dist')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});

// Start server
server.listen(PORT_URL, () => {
  console.log(`listening on ${PORT_URL} successfully`);
});
