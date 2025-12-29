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
            const formattedMessages = messages.map(msg => {
                const received = new Date(msg.createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
                return {
                    email: msg.email || 'Unknown sender',
                    body: msg.message || '',
                    received
                };
            });

            const primary = formattedMessages[0];
            const subject = primary.email ? `New portfolio message from ${primary.email}` : 'New portfolio message received';

            const htmlMessages = formattedMessages.map((item, idx) => `
                <section style="margin:0 0 ${idx === formattedMessages.length - 1 ? '0' : '18px'} 0; padding: 1rem">
                    <div style="font-size:14px;color:#444;">From</div>
                    <div style="font-size:16px;color:#111;font-weight:600;margin:4px 0 10px 0;">${item.email}</div>
                    <div style="font-size:14px;color:#444;">Message</div>
                    <div style="margin:6px 0 10px 0;padding:14px 16px;background:#f7f7f7;border:1px solid #e2e2e2;border-radius:6px;font-size:15px;line-height:1.5;color:#111;white-space:pre-wrap;">${item.body}</div>
                    <div style="font-size:13px;color:#666;">Received: ${item.received}</div>
                </section>
            `).join('');

            const mailOptions = {
                from: process.env.GMAIL_USER,
                to: process.env.NOTIFICATION_EMAIL,
                subject,
                text: formattedMessages.map(m => `From: ${m.email}\nMessage:\n${m.body}\nReceived: ${m.received}`).join('\n\n---\n\n'),
                html: `
                    <div style="background:#f4f5f7;padding:24px;">
                        <div style="max-width:640px;margin:0 auto;background:#ffffff;border:1px solid #e6e7eb;border-radius:8px;overflow:hidden;">
                            <header style="padding:20px 24px;border-bottom:1px solid #e6e7eb;">
                                <div style="font-size:18px;font-weight:700;color:#111;">New portfolio message</div>
                                <div style="margin-top:4px;font-size:14px;color:#555;">Delivered instantly from your site</div>
                            </header>
                            <main style="padding:20px 28px;">${htmlMessages}</main>
                            <footer style="padding:16px 28px;border-top:1px solid #e6e7eb;font-size:12px;color:#777;">This email was sent automatically when a visitor submitted the contact form.</footer>
                        </div>
                    </div>
                `
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
