import { Request, Response } from "express";
import { AppDataSource } from "../database/data-source";
import { UserInfoInterface } from "../interfaces/user_info.interface";
import { encrypt } from "../utils/helpers";
import userAge from "../utils/getUserAge";
import { UserInfoDto } from "../dto/user_info.dto";
import { BadRequestError } from "../errors";
import { StatusCodes } from "http-status-codes";
import { HttpException } from "../exceptions/HttpException";
import { UserInfoEntity } from "../entities/user_info.entity";
import { generateOTP, isEmpty } from "../utils/random_string";
import { welcomeEmail } from "../utils/emails/welcome_email";
import { AuthenticatedRequest } from "../middleware/auth.middleware";
import { resetEmail } from "../utils/emails/reset_email";
import { VERIFICATION_STATUS } from "../enums/VERIFICATION_STATUS.enum";
import { UserInfoLoginDto } from "../dto/user_info_login.dto";
import { USER_ROLES } from "../enums/USER_ROLES.enum";
console.log("App running")
export class AuthService {
    public users = UserInfoEntity;
    
    public async signup(userData:UserInfoDto, req:Request, res:Response) {
        const userRepository = await AppDataSource.getRepository(this.users);
        const existingUser = await userRepository.findOne({ where: { email: userData.email }  });
        if (existingUser) throw new HttpException(StatusCodes.BAD_REQUEST, 'Email is already in use. Please choose another email.')
        const encryptedPassword = await encrypt.encryptpass(userData.password);
        console.log(encryptedPassword);
        const createUserData: UserInfoInterface = await userRepository.create({ ...userData, password: encryptedPassword });
        createUserData.full_name = `${createUserData.first_name} ${createUserData.last_name}`;
        createUserData.age = userAge(createUserData.date_of_birth);
        if(createUserData.role == USER_ROLES.ADMIN || createUserData.role == USER_ROLES.SUPER_ADMIN) throw new HttpException(StatusCodes.UNAUTHORIZED, 'You do not have the privilege to set role as admin or super-admin')
        createUserData.otp = Number(generateOTP());

        await userRepository.save(createUserData);
        const newSanitizedUser = this.sanitizeUser(createUserData);
        console.log(newSanitizedUser)
        await welcomeEmail(createUserData.first_name, createUserData.email, createUserData.otp);
        // let msg = `An OTP has been sent to for verification.`;
		let msg = `An OTP has been sent to ${createUserData.email} for verification.!!Kindly confirm and verify your account`;

		return ({ status: "success", message: msg });
        //return { newSanitizedUser };
    };

    public async login(userData:UserInfoLoginDto, req:Request, res:Response) {
        if (isEmpty(userData)) throw new HttpException(StatusCodes.BAD_REQUEST,"Pls provide the required data");

        const userRepository = AppDataSource.getRepository(this.users);
        const findUser: UserInfoInterface = await userRepository.findOne({ where: { email: userData.email }  });
        if (!findUser) throw new HttpException(StatusCodes.NOT_FOUND, `User with email:${userData.email} not found`);
        const isValidPassword = await encrypt.comparepassword(findUser.password, userData.password);
        if(!isValidPassword) throw new HttpException(StatusCodes.BAD_REQUEST, `Incorrect Password!!Please try again`);

        // User is authenticated, generate token and send response
        const token = encrypt.generateToken({
        id: findUser.id,
        first_name: findUser.first_name,
        email: findUser.email,
        role: findUser.role,
       });
       const newSanitizedUser = this.sanitizeUser(findUser);
      
      return { newSanitizedUser, token };

    };

    public async adminSignup(adminData:UserInfoDto, req:Request, res:Response) {
        const adminRepository = await AppDataSource.getRepository(this.users);
        const existingAdmin = await adminRepository.findOne({ where: { email: adminData.email }  });
        if (existingAdmin) throw new HttpException(StatusCodes.BAD_REQUEST, 'Email is already in use. Please choose another email.')
        const encryptedPassword = await encrypt.encryptpass(adminData.password);
        console.log(encryptedPassword);
        const createAdminData: UserInfoInterface = await adminRepository.create({ ...adminData, password: encryptedPassword });
        createAdminData.full_name = `${createAdminData.first_name} ${createAdminData.last_name}`;
        createAdminData.age = userAge(createAdminData.date_of_birth);
        createAdminData.otp = Number(generateOTP());

        await adminRepository.save(createAdminData);
        const newSanitizedUser = this.sanitizeUser(createAdminData);
        console.log(newSanitizedUser)
        await welcomeEmail(createAdminData.first_name, createAdminData.email, createAdminData.otp);
        // let msg = `An OTP has been sent to for verification.`;
		let msg = `An OTP has been sent to ${createAdminData.email} for verification.!!Kindly confirm and verify your account`;

		return ({ status: "success", message: msg });
        //return { newSanitizedUser };
    };

    public async verifyOtp(otp: string): Promise<any> {
        if (isEmpty(otp)) throw new BadRequestError("Please provide the required otp");
        const userRepository = AppDataSource.getRepository(this.users);
        const user = await userRepository.findOne({ where: { otp: Number(otp) } });
        if(!user) throw new HttpException(StatusCodes.NOT_FOUND, 'Invalid OTP!!Please enter the correct OTP sent to your mail.')
        return user;
    };

    public async verifyEmail(token: string) {
        const userRepository = AppDataSource.getRepository(this.users);
        const user = await userRepository.findOne({ where: { otp: Number(token) } });

        if (!user) {
            throw new HttpException(400, 'Invalid token, please check your email for a valid one');
        }

        user.verification_status = VERIFICATION_STATUS.VERIFIED;
        const updatedUser = await userRepository.save(user);

        if (!updatedUser) {
            throw new HttpException(400, 'Could not verify email, something went wrong');
        }
        const newSanitizedUser = this.sanitizeUser(updatedUser);

        return { newSanitizedUser };
    };

    public async resendOtp(email: string, req:AuthenticatedRequest): Promise<any> {
        if (isEmpty(email)) throw new BadRequestError("Please provide your valid email!!");
        //const userId = req.user.id;
        const userRepository = AppDataSource.getRepository(this.users);
        const user = await userRepository.findOne({ where: { email: email } });
        if(!user) throw new HttpException(StatusCodes.NOT_FOUND, 'User With the email not found')
        user.otp = generateOTP();
        await userRepository.save(user);
        await resetEmail(req,user.first_name, user.email, user.otp);
    };


    // Adjusted sanitizeUser method
    public sanitizeUser(user: UserInfoInterface): Partial<UserInfoInterface> {
        const { password, ...sanitizedUser } = user;
        return sanitizedUser;
      };
}
