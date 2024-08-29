import * as nodemailer from 'nodemailer';

const testTransporter = nodemailer.createTransport({
    host: 'sandbox.smtp.mailtrap.io',
    port: 2525,
    auth: {
        user: 'ee95a60ee7b4e6',
        pass: '0123779caa9284',
    },
});

testTransporter.verify(function(error, success) {
    if (error) {
        console.log('SMTP connection error:', error);
    } else {
        console.log('SMTP server is ready to take our messages');
    }
});
