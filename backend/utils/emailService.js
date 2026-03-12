const nodemailer = require('nodemailer');

const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;

let transporter = null;
let EMAIL_ENABLED = true;

// Disable email if env values are missing or placeholders are present
if (!EMAIL_USER || !EMAIL_PASSWORD || EMAIL_USER.includes('your-') || EMAIL_PASSWORD.includes('your-')) {
    console.log('⚠️ Email service disabled: missing or placeholder credentials in .env. Emails will be skipped.');
    EMAIL_ENABLED = false;
} else {
    transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: EMAIL_USER,
            pass: EMAIL_PASSWORD
        }
    });

    // Test connection asynchronously. If verification fails, disable email sending but do not crash the app.
    transporter.verify()
        .then(() => {
            console.log('✅ Email service ready');
        })
        .catch((error) => {
            console.log('❌ Email service not configured properly:', error.message);
            EMAIL_ENABLED = false;
        });
}

const noopLog = (action, details) => {
    console.log(`⚠️ Email disabled — skipping ${action}${details ? `: ${details}` : ''}`);
};

// Send registration confirmation email
const sendWelcomeEmail = async (user) => {
    if (!EMAIL_ENABLED) return noopLog('welcome email', user?.email);

    try {
        const mailOptions = {
            from: EMAIL_USER || 'noreply@foodwastage.com',
            to: user.email,
            subject: 'Welcome to ZeroWaste - Food Wastage Reduction!',
            html: `
                <h2>Welcome to ZeroWaste!</h2>
                <p>Hi ${user.name},</p>
                <p>Your account has been successfully created.</p>
                <p><strong>Account Details:</strong></p>
                <ul>
                    <li>Email: ${user.email}</li>
                    <li>Role: ${user.role}</li>
                    <li>Status: Active</li>
                </ul>
                <p>You can now login to your dashboard and start helping reduce food waste!</p>
                <p>Best regards,<br/>ZeroWaste Team</p>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log(`✅ Welcome email sent to ${user.email}`);
    } catch (error) {
        console.error('❌ Error sending welcome email:', error.message);
    }
};

// Send notification when new food is posted
const sendFoodPostedNotification = async (food, postedBy, allUsers) => {
    if (!EMAIL_ENABLED) return noopLog('food notification');

    try {
        // Send to all users except the one who posted
        const recipientEmails = allUsers
            .filter(u => u._id.toString() !== postedBy._id.toString())
            .map(u => u.email);

        if (recipientEmails.length === 0) return;

        const mailOptions = {
            from: EMAIL_USER || 'noreply@foodwastage.com',
            to: recipientEmails.join(','),
            subject: '🍽️ New Food Available - ZeroWaste Alert!',
            html: `
                <h2>New Food Posted on ZeroWaste!</h2>
                <p>Great news! Someone has posted surplus food that might help you.</p>
                <p><strong>Food Details:</strong></p>
                <ul>
                    <li><strong>Dish:</strong> ${food.dishName}</li>
                    <li><strong>Quantity:</strong> ${food.quantity} servings</li>
                    <li><strong>Location:</strong> ${food.location}</li>
                    <li><strong>Expires In:</strong> ${food.expiresIn} hours</li>
                    <li><strong>Can Feed:</strong> ~${food.estimatedPeople} people</li>
                    <li><strong>Posted By:</strong> ${postedBy.name} (${postedBy.role})</li>
                    <li><strong>Contact:</strong> ${food.contact}</li>
                </ul>
                <p><strong>Notes:</strong> ${food.notes || 'No additional notes'}</p>
                <p>🚨 <strong>Act Fast!</strong> This food expires in ${food.expiresIn} hours.</p>
                <p>Login to ZeroWaste to view more details and arrange pickup.</p>
                <p>Best regards,<br/>ZeroWaste Team</p>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log(`✅ Food notification sent to ${recipientEmails.length} users`);
    } catch (error) {
        console.error('❌ Error sending food notification:', error.message);
    }
};

// Send contact email for food inquiries
const sendContactEmail = async (to, subject, message) => {
    if (!EMAIL_ENABLED) return noopLog('contact email', to);

    try {
        const mailOptions = {
            from: EMAIL_USER || 'noreply@foodwastage.com',
            to: to,
            subject: subject,
            html: message
        };

        await transporter.sendMail(mailOptions);
        console.log(`✅ Contact email sent to ${to}`);
    } catch (error) {
        console.error('❌ Error sending contact email:', error.message);
    }
};

module.exports = {
    sendWelcomeEmail,
    sendFoodPostedNotification,
    sendContactEmail
};
