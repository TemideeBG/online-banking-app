import { sendEmail } from "./send_email";
import * as dotenv from 'dotenv';
dotenv.config();

const resetEmail = async (req: any, userName: string, email: string, otp: number) => {
    const capitalizedUserName =
        userName.charAt(0).toUpperCase() + userName.slice(1);
    const html = `Hello ${capitalizedUserName},
    <br/>
    <br>
    You are receiving this mail because you or someone else requested for a password change. <br>
    <br>
    <p> Please use this otp to Reset your password: <strong>${otp}</strong><br></p>
    <br/>
    If you did not make such request, please ignore this mail and your password will remain unchanged.
    <br/>
    <br><br>
    Kind Regards,
    <br>
    <br>
   <strong>AIRWAYS MONEY APP</strong>.

    `;

    await sendEmail({
        from: process.env.MAIL_USER as string,
        to: email,
        subject: 'AIRWAYS MONEY APP: OTP reset',
        html: html
    });
};

export { resetEmail };
