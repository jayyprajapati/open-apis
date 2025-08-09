// Test script to verify the notification system setup
require('dotenv').config();
const mongoose = require('mongoose');
const EmailService = require('./services/emailService');

async function testSetup() {
    console.log('🧪 Testing Portfolio Notification System Setup...\n');

    // 1. Check environment variables
    console.log('1. Checking environment variables...');
    const requiredEnvVars = ['MONGO_URI', 'GMAIL_USER', 'GMAIL_APP_PASSWORD', 'NOTIFICATION_EMAIL'];
    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
    
    if (missingVars.length > 0) {
        console.log('Missing environment variables:', missingVars.join(', '));
        console.log('Please check your .env file\n');
        return;
    }
    console.log('All required environment variables are set\n');

    // 2. Test MongoDB connection
    console.log('2. Testing MongoDB connection...');
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connection successful\n');
    } catch (error) {
        console.log('MongoDB connection failed:', error.message);
        return;
    }

    // 3. Test email service
    console.log('3. Testing email service connection...');
    const emailService = new EmailService();
    
    try {
        const connectionTest = await emailService.testConnection();
        if (connectionTest) {
            console.log('Email service connection successful\n');
        } else {
            console.log('Email service connection failed\n');
            return;
        }
    } catch (error) {
        console.log('Email service test failed:', error.message);
        return;
    }

    // 4. Test email sending (optional)
    console.log('4. Testing email sending...');
    const testMessage = [{
        email: 'test-setup@example.com',
        message: 'This is a test message from the notification system setup verification.',
        createdAt: new Date()
    }];

    try {
        const emailSent = await emailService.sendNotification(testMessage);
        if (emailSent) {
            console.log('Test notification email sent successfully!');
            console.log('📧 Check your email:', process.env.NOTIFICATION_EMAIL);
        } else {
            console.log('Failed to send test email');
        }
    } catch (error) {
        console.log('Email sending test failed:', error.message);
    }

    console.log('\nSetup verification complete!');
    console.log('Your notification system is ready to use.');
    console.log('\nScheduled times:');
    console.log('- Wednesday at 6:00 PM IST');
    console.log('- Saturday at 6:00 PM IST');
    
    mongoose.connection.close();
}

// Run the test
testSetup().catch(console.error);
