import { sendEmail } from "./send_email";
import * as dotenv from 'dotenv';
dotenv.config();

const accountEmail = async (req: any, userName: string, email: string, bankName: string, accountNumber: string, accountName: string, amount: string) => {
    const capitalizedUserName =
        userName.charAt(0).toUpperCase() + userName.slice(1);
    const html = `Thank you for using AIRWAYS MONEY APP, ${capitalizedUserName} We’re very excited to have you!,
    <br/>
    <br>
    Your bank account with <strong>${bankName}</strong> has been successfully created. 
    <br/>
    <br/>
    Your ACCOUNT NUMBER is: <strong>${accountNumber}</strong>,
    Your ACCOUNT BALANCE is: <strong>${amount}</strong>
    <br/>
    <br/>
    Your ACCOUNT NAME is: <strong>${accountName}</strong>
    <br><br>
    Cheers,
    <br>
    <strong>AIRWAYS MONEY APP</strong>.

    `;

    await sendEmail({
        from: process.env.MAIL_USER as string, 
        to: email,
        subject: 'Bank Account Successfully Created',
        html: html,
    });
};

export { accountEmail };