/* ============================================
   VERCEL SERVERLESS ENTRY POINT
   ============================================ */

const app = require('../server');
const connectDB = require('../config/db');

// Track DB connection state
let isConnected = false;

async function ensureDB() {
    if (!isConnected) {
        await connectDB();
        isConnected = true;
    }
}

// Vercel serverless handler
module.exports = async (req, res) => {
    try {
        await ensureDB();
        return app(req, res);
    } catch (error) {
        console.error('Serverless error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
};