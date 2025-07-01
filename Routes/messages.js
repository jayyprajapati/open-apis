const express = require("express");
const router = express.Router();
const Message = require('../Models/Message');

router.post('/sendMessage', async (req, res) => {
    try {
        const { email, message } = req.body;

        const newMessage = new Message({
            email,
            message
        });

        await newMessage.save();
        res.status(200).json({ success: true, message: 'Message received successfully' });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

module.exports = router;