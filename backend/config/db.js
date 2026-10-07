/* ============================================
   DATABASE CONNECTION
   ============================================ */

const mongoose = require('mongoose');

let isConnected = false;

async function connectDB() {
    if (isConnected) {
        console.log('📦 Using existing MongoDB connection');
        return;
    }

    try {
        console.log('⏳ Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        isConnected = true;
        console.log('✅ MongoDB Connected Successfully!');
        console.log(`📦 Database: ${mongoose.connection.name}`);
    } catch (error) {
        console.error('❌ MongoDB Error:', error.message);
        throw error;
    }
}

module.exports = connectDB;