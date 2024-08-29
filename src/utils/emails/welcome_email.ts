import { sendEmail } from "./send_email";
import * as dotenv from 'dotenv';
dotenv.config();

const welcomeEmail = async (userName: string, email: string, otp: number) => {
    const capitalizedUserName = userName.charAt(0).toUpperCase() + userName.slice(1);
    const html = `Welcome to AIRWAYS MONEY APP, ${capitalizedUserName}! We’re very excited to have you!
    <br/>
    <br>
    We offer quality financial services and make you feel warm. 
    <br/>
    <br/>
    Your OTP is: <strong>${otp}</strong>
    <br/>
    <br/>
    AIRWAYS MONEY APP will give you the best experience ever.
    <br><br>
    Cheers,
    <br>
    <strong>AIRWAYS MONEY APP</strong>.
    `;

    await sendEmail({
        from: process.env.MAIL_USER!,
        to: email,
        subject: 'Welcome to AIRWAYS MONEY APP',
        html: html,
    });
};

export { welcomeEmail };
