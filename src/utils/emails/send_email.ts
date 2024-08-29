import * as nodemailer from 'nodemailer';
import nodemailerConfig from '../nodemailer_config';
import * as dotenv from 'dotenv';

dotenv.config();

const sendEmail = async ({ from, to, subject, html }: { from?: string; to: string; subject: string; html: string }) => {
    try {
        const transporter = nodemailer.createTransport(nodemailerConfig);
        transporter.verify(function(error, success) {
            if (error) {
                console.log('SMTP connection error:', error);
            } else {
                console.log('SMTP server is ready to take our messages');
            }
        });

        const info = await transporter.sendMail({
            from: from || process.env.MAIL_USER || 'shittutemidayo16@gmail.com', // sender address
            to,
            subject,
            html,
        });

        console.log('Email sent: %s', info.messageId);
        return info;
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Email sending failed');
    }
};

export { sendEmail };
