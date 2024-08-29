import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { HttpException } from "../exceptions/HttpException";
import { AuthService } from "../services/auth.service";
import { UserInfoDto } from "../dto/user_info.dto";
import { AuthenticatedRequest } from "../middleware/auth.middleware";

export class AuthController {
    private authService: AuthService;
    
    constructor(){
        this.authService = new AuthService()
    }

    public userSignUp = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userData: UserInfoDto = req.body;

            const newUser = await this.authService.signup(userData,req,res);
            return res
                .status(StatusCodes.CREATED)
                .json({
                    data: newUser, 
                });
        } catch (error) {
            next(new HttpException(StatusCodes.INTERNAL_SERVER_ERROR, error.message));
        }
    };

    public login = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userData: UserInfoDto = req.body;

            const newUser = await this.authService.login(userData,req,res);
            return res
                .status(StatusCodes.OK)
                .json({
                    message: `Successfully Logged In as ${newUser.newSanitizedUser.first_name}`,
                    data: newUser, 
                });
        } catch (error) {
            next(new HttpException(StatusCodes.INTERNAL_SERVER_ERROR, error.message));
        }
    };

    public adminSignUp = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const adminData: UserInfoDto = req.body;

            const newAdmin = await this.authService.adminSignup(adminData,req,res);
            return res
                .status(StatusCodes.CREATED)
                .json({
                    data: newAdmin, 
                });
        } catch (error) {
            next(new HttpException(StatusCodes.INTERNAL_SERVER_ERROR, error.message));
        }
    };

    public verifyOtp = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const otp = req.body.otp || req.query.otp;
            if (!otp) {
                return res.status(StatusCodes.NOT_ACCEPTABLE).json({
                    status: "fail",
                    message: "Please enter the recent OTP sent to your email",
                });
            }

            const user = await this.authService.verifyOtp(otp);
            if (!user) {
                return res.status(StatusCodes.NOT_ACCEPTABLE).json({ status: "fail", message: "Invalid OTP" });
            }

            return res.status(StatusCodes.OK).json({
                status: "success",
                message: "OTP is valid",
            });
        } catch (error) {
            next(new HttpException(StatusCodes.INTERNAL_SERVER_ERROR, error.message));
        }
    };

    public verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userOtp = req.query.token as string;

            if (!userOtp) {
                return res
                    .status(StatusCodes.NOT_ACCEPTABLE)
                    .json({ status: "fail", message: "Verification token is required" });
            }

            const verifiedUser = await this.authService.verifyEmail(userOtp);

            return res
                .status(StatusCodes.OK)
                .json({
                    status: "success",
                    message: `Hi ${verifiedUser.newSanitizedUser.first_name}, your account has been successfully verified!`,
                    data: verifiedUser
                });
        } catch (error) {
            next(new HttpException(StatusCodes.INTERNAL_SERVER_ERROR, error.message));
        }
    };

    public resendOtp = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<any> => {
        try {
            //const userId = req.user.id; // Assuming userId is set in the request object
            const { email } = req.body;

            await this.authService.resendOtp(email,req);

            return res.status(StatusCodes.OK).json({ status: "success", message: "A new OTP has been sent to your email" });
        } catch (error) {
            next(new HttpException(StatusCodes.INTERNAL_SERVER_ERROR, error.message));
        }
    }
}
