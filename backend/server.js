/* ============================================
   NOVATRACK — Backend Server
   Node.js + Express + MongoDB
   ============================================ */

// ===== IMPORTS =====
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
require('dotenv').config();

// ===== APP SETUP =====
const app = express();
const PORT = process.env.PORT || 5000;

// ===== MIDDLEWARE =====
app.use(cors());
app.use(express.json());
// ===== API ROUTES =====
app.use('/api/auth', authRoutes);

// ===== TEST ROUTES =====
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: '🚀 NovaTrack API is running!',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
    });
});

app.get('/api/health', (req, res) => {
    res.json({
        status: 'healthy',
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development',
        database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    });
});

// ===== DATABASE CONNECTION =====
async function connectDB() {
    try {
        console.log('⏳ Connecting to MongoDB...');
        
        await mongoose.connect(process.env.MONGODB_URI);
        
        console.log('✅ MongoDB Connected Successfully!');
        console.log(`📦 Database: ${mongoose.connection.name}`);
        console.log(`🌐 Host: ${mongoose.connection.host}`);
    } catch (error) {
        console.error('❌ MongoDB Connection Error:', error.message);
        process.exit(1); // Exit if DB fails
    }
}

// ===== START SERVER =====
async function startServer() {
    await connectDB();

    app.listen(PORT, () => {
        console.log('');
        console.log('╔════════════════════════════════════════╗');
        console.log('║   🚀 NovaTrack Backend Server          ║');
        console.log('╠════════════════════════════════════════╣');
        console.log(`║   ✅ Running on: http://localhost:${PORT} ║`);
        console.log(`║   🌍 Environment: ${process.env.NODE_ENV}      ║`);
        console.log('╚════════════════════════════════════════╝');
        console.log('');
    });
}

startServer();