/* ============================================
   CONTACT CONTROLLER
   ============================================ */

const Message = require('../models/Message');

// ===== SUBMIT CONTACT FORM =====
// POST /api/contact
const submitContact = async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        // Validation
        if (!name || !email || !subject || !message) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all fields',
            });
        }

        if (message.length < 10) {
            return res.status(400).json({
                success: false,
                message: 'Message must be at least 10 characters',
            });
        }

        // Save to database
        const newMessage = await Message.create({
            name,
            email,
            subject,
            message,
        });

        res.status(201).json({
            success: true,
            message: 'Message sent successfully! We\'ll get back to you soon.',
            data: {
                id: newMessage._id,
                createdAt: newMessage.createdAt,
            },
        });
    } catch (error) {
        console.error('Contact form error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Server error',
        });
    }
};

// ===== GET ALL MESSAGES (admin) =====
// GET /api/contact
const getMessages = async (req, res) => {
    try {
        const messages = await Message.find().sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: messages.length,
            messages,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = { submitContact, getMessages };