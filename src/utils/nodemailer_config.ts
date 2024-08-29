import * as dotenv from 'dotenv';

dotenv.config();

export default {
    host: 'sandbox.smtp.mailtrap.io',
    port: 2525,
    auth:{
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD
    }
};
console.log('MAIL_USER:', process.env.MAIL_USER);
console.log('MAIL_PASSWORD:', process.env.MAIL_PASSWORD);

