/* ============================================
   NOVATRACK — Backend Server
   Node.js + Express + MongoDB
   Compatible with Vercel Serverless
   ============================================ */

// ===== IMPORTS =====
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const contactRoutes = require('./routes/contact');
require('dotenv').config();

// ===== APP SETUP =====
const app = express();
const PORT = process.env.PORT || 5000;

// ===== MIDDLEWARE =====
app.use(cors());
app.use(express.json());

// ===== API ROUTES =====
app.use('/api/auth', authRoutes);
app.use('/api/contact' , contactRoutes);

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
        database: 'checking...',
    });
});

// ===== 404 HANDLER =====
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} not found`,
    });
});

// ===== GLOBAL ERROR HANDLER =====
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({
        success: false,
        message: err.message || 'Internal server error',
    });
});

// ===== LOCAL DEVELOPMENT =====
// For Vercel: export the app
// For local: run the server

if (require.main === module) {
    // LOCAL DEVELOPMENT MODE
    connectDB()
        .then(() => {
            app.listen(PORT, () => {
                console.log('');
                console.log('╔════════════════════════════════════════╗');
                console.log('║   🚀 NovaTrack Backend Server          ║');
                console.log('╠════════════════════════════════════════╣');
                console.log(`║   ✅ Running on: http://localhost:${PORT} ║`);
                console.log(`║   🌍 Environment: ${process.env.NODE_ENV}       ║`);
                console.log('╚════════════════════════════════════════╝');
                console.log('');
            });
        })
        .catch((err) => {
            console.error('❌ Failed to start server:', err.message);
            process.exit(1);
        });
}

// ===== EXPORT FOR VERCEL SERVERLESS =====
module.exports = app;