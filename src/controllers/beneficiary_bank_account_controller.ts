import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { HttpException } from "../exceptions/HttpException";
import { AuthenticatedRequest } from "../middleware/auth.middleware";
import { UserService } from "../services/user_info_service";
import { UserBankService } from "../services/user_bank_account.service";
import { AuthService } from "../services/auth.service";
import { BeneficiaryBankAccountService } from "../services/beneficiary_bank_account.service";
import { BeneficiaryBankAccountDto } from "../dto/beneficiary_bank_account.dto";

export class BeneficiaryBankAccountController {
    private beneficiaryBankAccountService: BeneficiaryBankAccountService;
    constructor(){
        const authService = new AuthService();
        const userService = new UserService(authService);
        const userBankService = new UserBankService(userService);
        this.beneficiaryBankAccountService = new BeneficiaryBankAccountService(userService,userBankService);
    }

    public createBeneficiaryBankAccount = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            //const userId = req.params.userId as string;
            const beneficiaryBankData: BeneficiaryBankAccountDto = req.body;

            const newBeneficiaryBank = await this.beneficiaryBankAccountService.createBeneficiaryBankAccount(beneficiaryBankData,req);
            return res
                .status(StatusCodes.CREATED)
                .json({
                    message: `Successfully Created ${req.user.first_name} beneficiary bank details`,
                    data: newBeneficiaryBank, 
                });
        } catch (error) {
            next(new HttpException(StatusCodes.INTERNAL_SERVER_ERROR, error.message));
        }
    };

    public getAllBeneficiariesBankAccounts = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const beneficiariesBankAccounts = await this.beneficiaryBankAccountService.getAllBeneficiaryBankAccounts();
            return res
                .status(StatusCodes.OK)
                .json({
                    data: beneficiariesBankAccounts, 
                });
        } catch (error) {
            next(new HttpException(StatusCodes.INTERNAL_SERVER_ERROR, error.message));
        }
    };

    public getBeneficiaryBankAccount = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const beneficiary_bank_id = req.params.beneficiary_bank_id as string;

            const beneficiaryBank = await this.beneficiaryBankAccountService.getSingleBeneficiaryAccount(beneficiary_bank_id,req);
            return res
                .status(StatusCodes.OK)
                .json({
                    message: `Successfully Retrieved Beneficiary Bank Account Details`,
                    data: beneficiaryBank, 
                });
        } catch (error) {
            next(new HttpException(StatusCodes.INTERNAL_SERVER_ERROR, error.message));
        }
    };

    public getUsersAssociatedToBeneficiaries = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const beneficiaryBank = await this.beneficiaryBankAccountService.beneficiariesAssociatedToUsers(req);
            return res
                .status(StatusCodes.OK)
                .json({
                    message: `Successfully Retrieved Users Associated to Beneficiary Bank Account Details`,
                    data: beneficiaryBank, 
                });
        } catch (error) {
            next(new HttpException(StatusCodes.INTERNAL_SERVER_ERROR, error.message));
        }
    };

    public deleteBeneficiaryBank = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const beneficiary_bank_id = req.params.beneficiary_bank_id as string;

            const deleteBeneficiaryBank = await this.beneficiaryBankAccountService.deleteBeneficiaryBankAccount(beneficiary_bank_id,req);
            return res
                .status(StatusCodes.OK)
                .json({
                    message: `Successfully Deleted Beneficiary Bank Account Associated to: ${req.user.first_name} `
                });
        } catch (error) {
            next(new HttpException(StatusCodes.INTERNAL_SERVER_ERROR, error.message));
        }
    };
}
