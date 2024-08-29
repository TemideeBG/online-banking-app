import { AppDataSource } from "../database/data-source";
import { BadRequestError } from "../errors";
import { StatusCodes } from "http-status-codes";
import { HttpException } from "../exceptions/HttpException";
import { isEmpty } from "../utils/random_string";
import { AuthenticatedRequest } from "../middleware/auth.middleware";
import { USER_ROLES } from "../enums/USER_ROLES.enum";
import { UserService } from "./user_info_service";
import { isValidCurrencySymbol } from "../utils/valid_currency_symbol";
import { BeneficiaryBankAccountEntity } from "../entities/beneficiary_bank_account.entity";
import { UserBankService } from "./user_bank_account.service";
import { BeneficiaryBankAccountDto } from "../dto/beneficiary_bank_account.dto";
import { BeneficiaryBankAccountInterface } from "../interfaces/beneficiary_bank_account.interface";

export class BeneficiaryBankAccountService  {
    public beneficiaryBankAccounts = BeneficiaryBankAccountEntity;
    constructor(private readonly userService: UserService, private readonly userBankService: UserBankService){
        this.userService = userService;
        this.userBankService = userBankService;
    };

    public async createBeneficiaryBankAccount(beneficiaryBankData:BeneficiaryBankAccountDto, req:AuthenticatedRequest) {
        if (isEmpty(beneficiaryBankData)) throw new BadRequestError("Please provide the required beneficiary bank info");
        const userId = req.user.id;
        const findUser = await this.userService.getSingleUser(userId,req);
        if(!findUser) throw new HttpException(StatusCodes.NOT_FOUND, 'User not found!!Please enter valid user id');
        const findUserBankAccount = await this.userBankService.getSingleAccount(beneficiaryBankData.user_bank_id,req);
        if(!findUserBankAccount) throw new HttpException(StatusCodes.NOT_FOUND, 'Account associated to user not found!!Please enter valid user bank id');
        // Check if the beneficiary already has a bank account
        const beneficiaryBankAccountRepository = AppDataSource.getRepository(this.beneficiaryBankAccounts);
        const existingAccount = await beneficiaryBankAccountRepository.findOne({ where: { account_name: beneficiaryBankData.account_name } });
        if (existingAccount) {
        throw new HttpException(StatusCodes.BAD_REQUEST, 'Beneficiary already exists');
      };
        
        if (!isValidCurrencySymbol(beneficiaryBankData.currency)) throw new HttpException(StatusCodes.NOT_FOUND, 'Invalid currency symbol!!Please enter valid currency');
        const createBeneficiaryBankAccount: BeneficiaryBankAccountInterface = await beneficiaryBankAccountRepository.create({ ...beneficiaryBankData});
        createBeneficiaryBankAccount.userInfo = findUser;
        createBeneficiaryBankAccount.userBankAccount = findUserBankAccount;
        createBeneficiaryBankAccount.amount = `${beneficiaryBankData.currency}${createBeneficiaryBankAccount.account_balance}`;
        const savedBeneficiaryAccount = await beneficiaryBankAccountRepository.save(createBeneficiaryBankAccount);
		return savedBeneficiaryAccount;
    };

    public async getAllBeneficiaryBankAccounts(): Promise<BeneficiaryBankAccountInterface[]> {
        const beneficiaryBankAccountRepository = AppDataSource.getRepository(this.beneficiaryBankAccounts);
        const allBeneficiaryAccounts = await beneficiaryBankAccountRepository.find();
        if(!allBeneficiaryAccounts || allBeneficiaryAccounts.length === 0) throw new HttpException(StatusCodes.NOT_FOUND, 'Beneficiary Accounts are not yet associated to the users!!');
        return allBeneficiaryAccounts;
    };

    public async getSingleBeneficiaryAccount(beneficiaryBank_id:string, req:AuthenticatedRequest): Promise<any> {
        if (isEmpty(beneficiaryBank_id)) throw new BadRequestError("Please provide the required user bank id");
        const userId = req.user.id;
        const findUser = await this.userService.getSingleUser(userId,req);
        if(!findUser) throw new HttpException(StatusCodes.NOT_FOUND, 'User not found!!Please enter valid user id');
        const beneficiaryBankAccountRepository = AppDataSource.getRepository(this.beneficiaryBankAccounts);
        const beneficiaryAccount = await beneficiaryBankAccountRepository.findOne({ where: { id: beneficiaryBank_id }, relations: ['userInfo'] });
        console.log(findUser,beneficiaryAccount)
        if(!beneficiaryAccount) throw new HttpException(StatusCodes.NOT_FOUND, 'Beneficiary Account associated to user not found!!Please enter valid user account id');
        const hasSuperAdminRole = req.user.role.includes(USER_ROLES.SUPER_ADMIN);
        const hasAdminRole = req.user.role.includes(USER_ROLES.ADMIN);
        if (beneficiaryAccount.userInfo.id !== req.user.id && !hasSuperAdminRole && !hasAdminRole) throw new HttpException(StatusCodes.UNAUTHORIZED,'You do not have permission to retrieve beneficiary account information')
        return beneficiaryAccount;
    };

    public async beneficiariesAssociatedToUsers(req:AuthenticatedRequest) {
        const beneficiaryBankAccountRepository = AppDataSource.getRepository(this.beneficiaryBankAccounts);
        const beneficiaries = await beneficiaryBankAccountRepository.find({ where: { userInfo: { id: req.user.id } }, relations: ['userInfo'] });
        if(!beneficiaries || beneficiaries.length === 0) throw new HttpException(StatusCodes.NOT_FOUND, 'Beneficiary Accounts are not yet associated to the users!!');
        return beneficiaries;
      }

    public async deleteBeneficiaryBankAccount(beneficiaryBank_id: string, req:AuthenticatedRequest) {
        if (isEmpty(beneficiaryBank_id)) throw new BadRequestError("Please provide the required user bank id");
        const beneficiaryBankAccountRepository = AppDataSource.getRepository(this.beneficiaryBankAccounts);
        const beneficiaryBankAccountToDelete = await beneficiaryBankAccountRepository.findOne({ where: { id:beneficiaryBank_id }, relations: ['userInfo'] });
        if (!beneficiaryBankAccountToDelete) throw new HttpException(StatusCodes.NOT_FOUND, 'Bank Account Associated to User not found!!Please enter valid beneficiary bank id');
        const hasSuperAdminRole = req.user.role.includes(USER_ROLES.SUPER_ADMIN);
        const hasAdminRole = req.user.role.includes(USER_ROLES.ADMIN);
        if (beneficiaryBankAccountToDelete.userInfo.id !== req.user.id && !hasSuperAdminRole && !hasAdminRole) throw new HttpException(StatusCodes.UNAUTHORIZED,'You do not have permission to delete beneficiary account')
        return { msg: `Beneficiary: ${beneficiaryBankAccountToDelete.account_name} Successfully Deleted` };      
      };
}