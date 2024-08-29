import { AppDataSource } from "../database/data-source";
import { BadRequestError } from "../errors";
import { StatusCodes } from "http-status-codes";
import { HttpException } from "../exceptions/HttpException";
import { isEmpty } from "../utils/random_string";
import { AuthenticatedRequest } from "../middleware/auth.middleware";
import { USER_ROLES } from "../enums/USER_ROLES.enum";
import { UserBankAccountEntity } from "../entities/user_bank_account.entity";
import { UserService } from "./user_info_service";
import { UserBankAccountInterface } from "../interfaces/user_bank_account.interface";
import { UserBankAccountDto } from "../dto/user_bank_account.dto";
import { isValidCurrencySymbol } from "../utils/valid_currency_symbol";
import { accountEmail } from "../utils/emails/account_email";

export class UserBankService  {
    public userBankAccounts = UserBankAccountEntity;
    constructor(private readonly userService: UserService){
        this.userService = userService;
    };

    public async createUserBankAccount(userBankData:UserBankAccountDto, req:AuthenticatedRequest) {
        if (isEmpty(userBankData)) throw new BadRequestError("Please provide the required user bank info");
        const userId = req.user.id;
        const findUser = await this.userService.getSingleUser(userId,req);
        if(!findUser) throw new HttpException(StatusCodes.NOT_FOUND, 'User not found!!Please enter valid user id');
        // Check if the user already has a bank account
        const userBankAccountRepository = AppDataSource.getRepository(this.userBankAccounts);
        const existingAccount = await userBankAccountRepository.findOne({ where: { userInfo: findUser } });
        if (existingAccount) {
        throw new HttpException(StatusCodes.BAD_REQUEST, 'User already has a bank account');
      };
        
        if (!isValidCurrencySymbol(userBankData.currency)) throw new HttpException(StatusCodes.NOT_FOUND, 'Invalid currency symbol!!Please enter valid currency');
        const createUserBankAccount: UserBankAccountInterface = await userBankAccountRepository.create({ ...userBankData});
        createUserBankAccount.userInfo = findUser;
        createUserBankAccount.amount = `${userBankData.currency}${createUserBankAccount.account_balance}`;
        await userBankAccountRepository.save(createUserBankAccount);
        await accountEmail(req, findUser.first_name, findUser.email, createUserBankAccount.bank_name, createUserBankAccount.account_number, createUserBankAccount.account_name, createUserBankAccount.amount);
        // let msg = `An OTP has been sent to for verification.`;
		let msg = `Hi ${findUser.first_name}, You Successfully Created an account with ${createUserBankAccount.bank_name}!! Check your email for your bank details.`;

		return ({ status: "success", message: msg, id: createUserBankAccount.id });
    };

    public async getAllUserBankAccounts(): Promise<UserBankAccountInterface[]> {
        const userBankAccountRepository = AppDataSource.getRepository(this.userBankAccounts);
        const allUsersAccounts = await userBankAccountRepository.find();
        if(!allUsersAccounts || allUsersAccounts.length === 0) throw new HttpException(StatusCodes.NOT_FOUND, 'Accounts are not yet associated to the users!!');
        return allUsersAccounts;
    };

    public async getSingleAccount(userBank_id:string, req:AuthenticatedRequest): Promise<any> {
        if (isEmpty(userBank_id)) throw new BadRequestError("Please provide the required user bank id");
        const userId = req.user.id;
        const findUser = await this.userService.getSingleUser(userId,req);
        if(!findUser) throw new HttpException(StatusCodes.NOT_FOUND, 'User not found!!Please enter valid user id');
        const userBankAccountRepository = AppDataSource.getRepository(this.userBankAccounts);
        const userBank = await userBankAccountRepository.findOne({ where: { id: userBank_id }, relations: ['userInfo'] });
        console.log(findUser,userBank)
        if(!userBank) throw new HttpException(StatusCodes.NOT_FOUND, 'Account associated to user not found!!Please enter valid user account id');
        const hasSuperAdminRole = req.user.role.includes(USER_ROLES.SUPER_ADMIN);
        const hasAdminRole = req.user.role.includes(USER_ROLES.ADMIN);
        if (userBank.userInfo.id !== req.user.id && !hasSuperAdminRole && !hasAdminRole) throw new HttpException(StatusCodes.UNAUTHORIZED,'You do not have permission to retrieve user account information')
        return userBank;
    };

    public async deleteUserBankAccount(userBank_id: string, req:AuthenticatedRequest) {
        if (isEmpty(userBank_id)) throw new BadRequestError("Please provide the required user bank id");
        const userBankAccountRepository = AppDataSource.getRepository(this.userBankAccounts);
        const userBankAccountToDelete = await userBankAccountRepository.findOne({ where: { id:userBank_id } });
        if (!userBankAccountToDelete) throw new HttpException(StatusCodes.NOT_FOUND, 'Bank Account Associated to User not found!!Please enter valid user bank id');
        return { msg: `user: ${userBankAccountToDelete.userInfo.first_name} ${userBankAccountToDelete.userInfo.last_name} Successfully Deleted` };      
      };
}