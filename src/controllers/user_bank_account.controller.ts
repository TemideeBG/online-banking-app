import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { HttpException } from "../exceptions/HttpException";
import { AuthenticatedRequest } from "../middleware/auth.middleware";
import { UserService } from "../services/user_info_service";
import { UserBankService } from "../services/user_bank_account.service";
import { UserBankAccountDto } from "../dto/user_bank_account.dto";
import { AuthService } from "../services/auth.service";

export class UserBankAccountController {
    private userBankService: UserBankService;
    constructor(){
        const authService = new AuthService();
        const userService = new UserService(authService);
        this.userBankService = new UserBankService(userService);
    }

    public createUserBank = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            //const userId = req.params.userId as string;
            const userBankData: UserBankAccountDto = req.body;

            const newUserBank = await this.userBankService.createUserBankAccount(userBankData,req);
            return res
                .status(StatusCodes.CREATED)
                .json({
                    message: `Successfully Created ${req.user.first_name} user bank details`,
                    data: newUserBank, 
                });
        } catch (error) {
            next(new HttpException(StatusCodes.INTERNAL_SERVER_ERROR, error.message));
        }
    };

    public getAllUsersBankAccounts = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const usersBankAccounts = await this.userBankService.getAllUserBankAccounts();
            return res
                .status(StatusCodes.OK)
                .json({
                    data: usersBankAccounts, 
                });
        } catch (error) {
            next(new HttpException(StatusCodes.INTERNAL_SERVER_ERROR, error.message));
        }
    };

    public getUserBankAccount = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const userBank_id = req.params.userBank_id as string;

            const userBank = await this.userBankService.getSingleAccount(userBank_id,req);
            return res
                .status(StatusCodes.OK)
                .json({
                    message: `Successfully Retrieved User Bank Account Details`,
                    data: userBank, 
                });
        } catch (error) {
            next(new HttpException(StatusCodes.INTERNAL_SERVER_ERROR, error.message));
        }
    };

    public deleteUserBank = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const userBank_id = req.params.userBank_id as string;

            const deleteUserBank = await this.userBankService.deleteUserBankAccount(userBank_id,req);
            return res
                .status(StatusCodes.OK)
                .json({
                    message: `Successfully Deleted User Bank Account Associated to: ${req.user.first_name} `
                });
        } catch (error) {
            next(new HttpException(StatusCodes.INTERNAL_SERVER_ERROR, error.message));
        }
    };
}
