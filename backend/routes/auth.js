/* ============================================
   AUTH ROUTES
   /api/auth/*
   ============================================ */

const express = require('express');
const router = express.Router();

const {
    signup,
    login,
    getMe,
    updateProfile,
    changePassword,
    deleteAccount,
} = require('../controllers/authController');

const { protect } = require('../middleware/auth');

// Public routes
router.post('/signup', signup);
router.post('/login', login);

// Protected routes
router.get('/me', protect, getMe);
router.put('/update-profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);
router.delete('/delete-account', protect, deleteAccount);

module.exports = router;