const cron = require('node-cron');
const Message = require('../Models/Message');
const EmailService = require('./emailService');

class ScheduledJobs {
    constructor() {
        this.emailService = new EmailService();
        this.isJobRunning = false;
    }

    async processUnsentMessages() {
        if (this.isJobRunning) {
            console.log('Job already running, skipping this execution');
            return;
        }

        this.isJobRunning = true;
        console.log('Starting scheduled job to process unsent messages...');

        try {
            // Find all messages where sent status is false
            const unsentMessages = await Message.find({ sent: false }).sort({ createdAt: -1 });
            
            if (unsentMessages.length === 0) {
                console.log('No unsent messages found');
                this.isJobRunning = false;
                return;
            }

            console.log(`Found ${unsentMessages.length} unsent messages`);

            // Send notification email
            const emailSent = await this.emailService.sendNotification(unsentMessages);
            
            if (emailSent) {
                // Mark messages as sent
                const messageIds = unsentMessages.map(msg => msg._id);
                await Message.updateMany(
                    { _id: { $in: messageIds } },
                    { $set: { sent: true } }
                );
                
                console.log(`Successfully processed ${unsentMessages.length} messages`);
            } else {
                console.error('Failed to send notification email');
            }

        } catch (error) {
            console.error('Error in scheduled job:', error);
        } finally {
            this.isJobRunning = false;
        }
    }

    startScheduledJobs() {
        // Wednesday at 6:00 PM IST (12:30 PM UTC)
        cron.schedule('30 12 * * 3', () => {
            console.log('Running Wednesday evening job...');
            this.processUnsentMessages();
        }, {
            timezone: 'Asia/Kolkata'
        });

        // Saturday at 6:00 PM IST (12:30 PM UTC) 
        cron.schedule('30 12 * * 6', () => {
            console.log('Running Saturday evening job...');
            this.processUnsentMessages();
        }, {
            timezone: 'Asia/Kolkata'
        });

        console.log('Scheduled jobs started:');
        console.log('- Wednesday at 6:00 PM IST');
        console.log('- Saturday at 6:00 PM IST');
    }

    // Manual trigger for testing
    async triggerManually() {
        console.log('Manually triggering job...');
        await this.processUnsentMessages();
    }

    // Get job status
    getJobStatus() {
        return {
            isJobRunning: this.isJobRunning,
            nextWednesday: this.getNextScheduleTime('wednesday'),
            nextSaturday: this.getNextScheduleTime('saturday')
        };
    }

    getNextScheduleTime(day) {
        const now = new Date();
        const targetDay = day === 'wednesday' ? 3 : 6; // Wednesday = 3, Saturday = 6
        const targetHour = 18; // 6 PM
        
        let nextRun = new Date(now);
        nextRun.setHours(targetHour, 0, 0, 0);
        
        // Calculate days until next target day
        const daysUntilTarget = (targetDay + 7 - now.getDay()) % 7;
        
        if (daysUntilTarget === 0 && now.getHours() >= targetHour) {
            // If it's the target day but past the time, schedule for next week
            nextRun.setDate(nextRun.getDate() + 7);
        } else {
            nextRun.setDate(nextRun.getDate() + daysUntilTarget);
        }
        
        return nextRun.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
    }
}

module.exports = ScheduledJobs;
