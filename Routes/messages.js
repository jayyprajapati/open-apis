const express = require("express");
const router = express.Router();
const Message = require('../Models/Message');
const EmailService = require('../services/emailService');

router.post('/sendMessage', async (req, res) => {
    const emailService = new EmailService();

    try {
        const { email, message } = req.body;

        const newMessage = new Message({
            email,
            message
        });

        await newMessage.save();

        const emailSent = await emailService.sendNotification([newMessage]);

        if (emailSent) {
            newMessage.sent = true;
            await newMessage.save();
            return res.status(200).json({ success: true, message: 'Message received successfully' });
        }

        console.error('Failed to send notification email for message:', newMessage._id);
        res.status(500).json({ success: false, error: 'Failed to send notification email' });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

module.exports = router;