const express = require("express");
const router = express.Router();
const Message = require('../Models/Message');
const EmailService = require('../services/emailService');

// Get all unsent messages
router.get('/unsent', async (req, res) => {
    try {
        const unsentMessages = await Message.find({ sent: false }).sort({ createdAt: -1 });
        res.status(200).json({ 
            success: true, 
            count: unsentMessages.length,
            messages: unsentMessages 
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get all messages with pagination
router.get('/all', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const messages = await Message.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Message.countDocuments();
        
        res.status(200).json({ 
            success: true, 
            messages,
            pagination: {
                current: page,
                total: Math.ceil(total / limit),
                count: messages.length,
                totalMessages: total
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Mark specific message as sent
router.put('/mark-sent/:id', async (req, res) => {
    try {
        const message = await Message.findByIdAndUpdate(
            req.params.id,
            { sent: true },
            { new: true }
        );
        
        if (!message) {
            return res.status(404).json({ success: false, error: 'Message not found' });
        }
        
        res.status(200).json({ 
            success: true, 
            message: 'Message marked as sent',
            data: message 
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Mark all messages as sent
router.put('/mark-all-sent', async (req, res) => {
    try {
        const result = await Message.updateMany(
            { sent: false },
            { $set: { sent: true } }
        );
        
        res.status(200).json({ 
            success: true, 
            message: `${result.modifiedCount} messages marked as sent`
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Test email service
router.post('/test-email', async (req, res) => {
    try {
        const emailService = new EmailService();
        const testMessage = [{
            email: 'test@example.com',
            message: 'This is a test notification email',
            createdAt: new Date()
        }];
        
        const result = await emailService.sendNotification(testMessage);
        
        if (result) {
            res.status(200).json({ 
                success: true, 
                message: 'Test email sent successfully' 
            });
        } else {
            res.status(500).json({ 
                success: false, 
                error: 'Failed to send test email' 
            });
        }
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Manual trigger for notification job
router.post('/trigger-job', async (req, res) => {
    try {
        const ScheduledJobs = require('../services/scheduledJobs');
        const jobService = new ScheduledJobs();
        
        // Run the job manually
        await jobService.triggerManually();
        
        res.status(200).json({ 
            success: true, 
            message: 'Notification job triggered manually' 
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get job status and next run times
router.get('/job-status', (req, res) => {
    try {
        const ScheduledJobs = require('../services/scheduledJobs');
        const jobService = new ScheduledJobs();
        const status = jobService.getJobStatus();
        
        res.status(200).json({ 
            success: true, 
            status 
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;
