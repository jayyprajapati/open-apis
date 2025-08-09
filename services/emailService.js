const nodemailer = require('nodemailer');

class EmailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_APP_PASSWORD
            }
        });
    }

    async sendNotification(messages) {
        try {
            const messageList = messages.map(msg => 
                `Email: ${msg.email}\nMessage: ${msg.message}\nReceived: ${new Date(msg.createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}\n${'='.repeat(50)}`
            ).join('\n\n');

            const mailOptions = {
                from: process.env.GMAIL_USER,
                to: process.env.NOTIFICATION_EMAIL,
                subject: `Portfolio Contact Notifications - ${messages.length} New Messages`,
                text: `Hi Jay,\n\nYou have received ${messages.length} new contact message(s) from your portfolio:\n\n${messageList}\n\nPlease check your admin panel for more details.\n\nBest regards,\nYour Portfolio Notification System`
            };

            const result = await this.transporter.sendMail(mailOptions);
            console.log('Notification email sent successfully:', result.messageId);
            return true;
        } catch (error) {
            console.error('Error sending notification email:', error);
            return false;
        }
    }

    async testConnection() {
        try {
            await this.transporter.verify();
            console.log('Email service is ready');
            return true;
        } catch (error) {
            console.error('Email service connection failed:', error);
            return false;
        }
    }
}

module.exports = EmailService;
