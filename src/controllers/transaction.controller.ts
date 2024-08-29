import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { HttpException } from "../exceptions/HttpException";
import { AuthenticatedRequest } from "../middleware/auth.middleware";
import { UserService } from "../services/user_info_service";
import { UserBankService } from "../services/user_bank_account.service";
import { AuthService } from "../services/auth.service";
import { BeneficiaryBankAccountService } from "../services/beneficiary_bank_account.service";
import { BeneficiaryBankAccountDto } from "../dto/beneficiary_bank_account.dto";
import { TransactionService } from "../services/transaction.service";
import { TransactiontDto } from "../dto/transaction.dto";

export class TransactionController {
    private transactionService: TransactionService;
    constructor(){
        const authService = new AuthService();
        const userService = new UserService(authService);
        const userBankService = new UserBankService(userService);
        const beneficiaryBankAccountService = new BeneficiaryBankAccountService(userService,userBankService);
        this.transactionService = new TransactionService(userService,userBankService,beneficiaryBankAccountService);
    }

    public createTransaction = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            //const userId = req.params.userId as string;
            const transactionData: TransactiontDto = req.body;

            const newTransaction = await this.transactionService.createTransaction(transactionData,req);
            return res
                .status(StatusCodes.CREATED)
                .json({
                    message: `Successfully Created ${req.user.first_name} Transaction Details `,
                    data: newTransaction, 
                });
        } catch (error) {
            next(new HttpException(StatusCodes.INTERNAL_SERVER_ERROR, error.message));
        }
    };

    public getAllTransactions = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const transactions = await this.transactionService.getAllTransactions();
            return res
                .status(StatusCodes.OK)
                .json({
                    data: transactions, 
                });
        } catch (error) {
            next(new HttpException(StatusCodes.INTERNAL_SERVER_ERROR, error.message));
        }
    };

    public getSingleTransaction = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const transaction_id = req.params.transaction_id as string;

            const transaction = await this.transactionService.getSingleTransaction(transaction_id,req);
            return res
                .status(StatusCodes.OK)
                .json({
                    message: `Successfully Retrieved Transaction Details`,
                    data: transaction, 
                });
        } catch (error) {
            next(new HttpException(StatusCodes.INTERNAL_SERVER_ERROR, error.message));
        }
    };

    public getUsersAssociatedToTransactions = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const transactions = await this.transactionService.transactionsAssociatedToUsers(req);
            return res
                .status(StatusCodes.OK)
                .json({
                    message: `Successfully Retrieved Users Associated to Transaction Details`,
                    data: transactions, 
                });
        } catch (error) {
            next(new HttpException(StatusCodes.INTERNAL_SERVER_ERROR, error.message));
        }
    };

    public deleteTransaction = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const transaction_id = req.params.transaction_id as string;

            const deleteTransaction = await this.transactionService.deleteTransaction(transaction_id,req);
            return res
                .status(StatusCodes.OK)
                .json({
                    message: `Successfully Deleted Transaction Associated to: ${req.user.first_name} `
                });
        } catch (error) {
            next(new HttpException(StatusCodes.INTERNAL_SERVER_ERROR, error.message));
        }
    };
}
