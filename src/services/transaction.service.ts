import { AppDataSource } from "../database/data-source";
import { BadRequestError } from "../errors";
import { StatusCodes } from "http-status-codes";
import { HttpException } from "../exceptions/HttpException";
import { isEmpty, transactionReference } from "../utils/random_string";
import { AuthenticatedRequest } from "../middleware/auth.middleware";
import { UserService } from "./user_info_service";
import { isValidCurrencySymbol } from "../utils/valid_currency_symbol";
import { BeneficiaryBankAccountEntity } from "../entities/beneficiary_bank_account.entity";
import { UserBankService } from "./user_bank_account.service";
import { BeneficiaryBankAccountService } from "./beneficiary_bank_account.service";
import { TransactionEntity } from "../entities/transaction.entity";
import { TransactiontDto } from "../dto/transaction.dto";
import { TransactionInterface } from "../interfaces/transaction.interface";
import { TRANSACTION_STATUS } from "../enums/TRANSACTION_STATUS.enum";
import { UserBankAccountEntity } from "../entities/user_bank_account.entity";
import { USER_ROLES } from "../enums/USER_ROLES.enum";

export class TransactionService  {
    public transactions = TransactionEntity;
    constructor(private readonly userService: UserService, 
                private readonly userBankService: UserBankService, 
                private readonly beneficiaryBankAccountService: BeneficiaryBankAccountService){
        this.userService = userService;
        this.userBankService = userBankService;
        this.beneficiaryBankAccountService = beneficiaryBankAccountService;
    };

    public async createTransaction(transactionData:TransactiontDto, req:AuthenticatedRequest) {
        if (isEmpty(transactionData)) throw new BadRequestError("Please provide the required transaction info");
        const userId = req.user.id;
        const { beneficiary_bank_id, funds_transferred } = transactionData;
        const findUser = await this.userService.getSingleUser(userId,req);
        if(!findUser) throw new HttpException(StatusCodes.NOT_FOUND, 'User not found!!Please enter valid user id');
        const findUserBankAccount = await this.userBankService.getSingleAccount(transactionData.user_bank_id,req);
        if(!findUserBankAccount) throw new HttpException(StatusCodes.NOT_FOUND, 'Account associated to user not found!!Please enter valid user bank id');
        const findBeneficiaryBankAccount = await this.beneficiaryBankAccountService.getSingleBeneficiaryAccount(beneficiary_bank_id,req);
        if(!findBeneficiaryBankAccount) throw new HttpException(StatusCodes.NOT_FOUND, 'Beneficiary Account not found!!Please enter valid beneficiary bank id');
        // Check if the transaction already exist;
        const transactionRepository = AppDataSource.getRepository(this.transactions);
        const existingTransaction = await transactionRepository.findOne({ where: { transaction_reference: transactionReference() } });
        //console.log(existingTransaction.transaction_reference)
        if (existingTransaction) {
        throw new HttpException(StatusCodes.BAD_REQUEST, 'This transaction has already been created');
      };
        
        if (!isValidCurrencySymbol(transactionData.currency)) throw new HttpException(StatusCodes.BAD_REQUEST, 'Invalid currency symbol!!Please enter valid currency');
        if (transactionData.currency !== findUserBankAccount.currency) throw new HttpException(StatusCodes.NOT_FOUND, 'Invalid currency symbol!!Please enter currency associated with your account');
        const createAndSaveTransaction = async ()=> {
          const createTransaction: TransactionInterface = await transactionRepository.create({ ...transactionData });
          createTransaction.userInfo = findUser;
          createTransaction.userBankAccount = findUserBankAccount;
          createTransaction.beneficiaryBankAccount = findBeneficiaryBankAccount;
          createTransaction.transaction_reference = transactionReference();
          createTransaction.amount = `${transactionData.currency}${createTransaction.funds_transferred}`;
          createTransaction.transaction_status = TRANSACTION_STATUS.COMPLETED;
          return await transactionRepository.save(createTransaction);
        };

        if (findUserBankAccount.currency == '₦' && findBeneficiaryBankAccount.currency == '€') {
          transactionData.conversion_rate = 1,766.98;
          transactionData.conversion_amount = funds_transferred / transactionData.conversion_rate;
          if (transactionData.conversion_amount > findUserBankAccount.account_balance) throw new HttpException(StatusCodes.NOT_FOUND, 'Insufficient Funds!!Please enter an amount less than your acc balance');
          transactionData.bank_charges = 200.00;
          await this.updateAccount(findUserBankAccount, findBeneficiaryBankAccount, transactionData.conversion_amount, transactionData.bank_charges);
          return await createAndSaveTransaction();   
        }

        if (findUserBankAccount.currency == '₦' && findBeneficiaryBankAccount.currency == '$') {
          transactionData.conversion_rate = 1,590.63;
          transactionData.conversion_amount = funds_transferred / transactionData.conversion_rate;
          if (transactionData.conversion_amount > findUserBankAccount.account_balance) throw new HttpException(StatusCodes.BAD_REQUEST, 'Insufficient Funds!!Please enter an amount less than your acc balance');
          transactionData.bank_charges = 200.00;
          await this.updateAccount(findUserBankAccount, findBeneficiaryBankAccount, transactionData.conversion_amount, transactionData.bank_charges);
          return await createAndSaveTransaction();   
        }

        if (findUserBankAccount.currency == '₦' && findBeneficiaryBankAccount.currency == '₦') {
        if (funds_transferred > findUserBankAccount.account_balance) throw new HttpException(StatusCodes.BAD_REQUEST, 'Insufficient Funds!!Please enter an amount less than your acc balance');
        const bankCharges = {
          sameBank: { low: 30.00, high: 60.00 },
          differentBank: { low: 40.00, high: 80.00 }
        };
        
        const chargeCategory = findUserBankAccount.bank_name === findBeneficiaryBankAccount.bank_name ? 'sameBank' : 'differentBank';
        transactionData.bank_charges = funds_transferred < 50000 ? bankCharges[chargeCategory].low : bankCharges[chargeCategory].high;
        await this.updateAccount(findUserBankAccount, findBeneficiaryBankAccount, funds_transferred, transactionData.bank_charges);
        return await createAndSaveTransaction();
        }    
    };

    public async getAllTransactions(): Promise<TransactionInterface[]> {
        const transactionRepository = AppDataSource.getRepository(this.transactions);
        const allTransactions = await transactionRepository.find();
        if(!allTransactions || allTransactions.length === 0) throw new HttpException(StatusCodes.NOT_FOUND, 'Transactions are yet to be generated by the users!!');
        return allTransactions;
    };

    public async getSingleTransaction(transaction_id:string, req:AuthenticatedRequest): Promise<any> {
        if (isEmpty(transaction_id)) throw new BadRequestError("Please provide the required transaction id");
        const userId = req.user.id;
        const findUser = await this.userService.getSingleUser(userId,req);
        if(!findUser) throw new HttpException(StatusCodes.NOT_FOUND, 'User not found!!Please enter valid user id');
        const transactionRepository = AppDataSource.getRepository(this.transactions);
        const transaction = await transactionRepository.findOne({ where: { id: transaction_id }, relations: ['userInfo'] });
        console.log(findUser,transaction)
        if(!transaction) throw new HttpException(StatusCodes.NOT_FOUND, 'Transaction Details associated to user not found!!Please enter valid transaction id');
        const hasSuperAdminRole = req.user.role.includes(USER_ROLES.SUPER_ADMIN);
        const hasAdminRole = req.user.role.includes(USER_ROLES.ADMIN);
        if (transaction.userInfo.id !== req.user.id && !hasSuperAdminRole && !hasAdminRole) throw new HttpException(StatusCodes.UNAUTHORIZED,'You do not have permission to retrieve transaction information')
        return transaction;
    };

    public async transactionsAssociatedToUsers(req:AuthenticatedRequest) {
        const transactionRepository = AppDataSource.getRepository(this.transactions);
        const transactions = await transactionRepository.find({ where: { userInfo: { id: req.user.id } }, relations: ['userInfo'] });
        if(!transactions || transactions.length === 0) throw new HttpException(StatusCodes.NOT_FOUND, 'User is yet to carry out any transactions!!');
        return transactions;
      }

    public async deleteTransaction(transaction_id: string, req:AuthenticatedRequest) {
        if (isEmpty(transaction_id)) throw new BadRequestError("Please provide the required transaction id");
        const transactionRepository = AppDataSource.getRepository(this.transactions);
        const transactionToDelete = await transactionRepository.findOne({ where: { id:transaction_id }, relations: ['userInfo'] });
        if (!transactionToDelete) throw new HttpException(StatusCodes.NOT_FOUND, 'Transaction Associated to User not found!!Please enter valid transaction id');
        const hasSuperAdminRole = req.user.role.includes(USER_ROLES.SUPER_ADMIN);
        const hasAdminRole = req.user.role.includes(USER_ROLES.ADMIN);
        if (transactionToDelete.userInfo.id !== req.user.id && !hasSuperAdminRole && !hasAdminRole) throw new HttpException(StatusCodes.UNAUTHORIZED,'You do not have permission to delete transaction')
        return { msg: `Transaction Associated To: ${req.user.first_name} has been Successfully Deleted` };      
      };

      private async updateAccount(userBankAccount: UserBankAccountEntity, beneficiaryBankAccount: BeneficiaryBankAccountEntity, fundsTransferred: number, bank_charges: number) {
        // Deduct funds from user account
        userBankAccount.account_balance = parseFloat((userBankAccount.account_balance - fundsTransferred - bank_charges).toFixed(2));
        userBankAccount.amount = `${userBankAccount.currency}${userBankAccount.account_balance.toFixed(2)}`;
        console.log(userBankAccount.currency,userBankAccount.account_balance,userBankAccount.amount);

        // Ensure beneficiary account balance is a number
        const beneficiaryAccountBalance = parseFloat(beneficiaryBankAccount.account_balance.toString());
    
        // Credit funds to beneficiary account
        beneficiaryBankAccount.account_balance = parseFloat((beneficiaryAccountBalance + fundsTransferred).toFixed(2));
        beneficiaryBankAccount.amount = `${beneficiaryBankAccount.currency}${beneficiaryBankAccount.account_balance.toFixed(2)}`;
        console.log(beneficiaryBankAccount.currency,beneficiaryBankAccount.account_balance,beneficiaryBankAccount.amount)
    
        // Save the updated accounts
        await AppDataSource.getRepository(UserBankAccountEntity).save(userBankAccount);
        await AppDataSource.getRepository(BeneficiaryBankAccountEntity).save(beneficiaryBankAccount);
    };

  //   private async handleCurrencyConversionAndCharges(userAccount: UserBankAccountEntity, beneficiaryAccount: BeneficiaryBankAccountEntity, fundsTransferred: number, transactionData: TransactiontDto) {
  //     // Define conversion rates based on the currencies
  //     if (userAccount.currency === '₦' && beneficiaryAccount.currency === '€') {
  //         transactionData.conversion_rate = 1766.98;
  //     } else if (userAccount.currency === '₦' && beneficiaryAccount.currency === '$') {
  //         transactionData.conversion_rate = 1590.63;
  //     }
  
  //     if (transactionData.conversion_rate) {
  //         transactionData.conversion_amount = fundsTransferred / transactionData.conversion_rate;
  //         transactionData.bank_charges = 200.00;
  //         if (transactionData.conversion_amount > userAccount.account_balance) throw new HttpException(StatusCodes.BAD_REQUEST, 'Insufficient Funds!! Please enter an amount less than your account balance'); 
  //         await this.updateAccount(userAccount, beneficiaryAccount, transactionData.conversion_amount, transactionData.bank_charges);
  //     } else if (userAccount.currency === beneficiaryAccount.currency) {
  //       // Handle bank charges when both currencies are the same
  //       if (userAccount.currency === '₦' && beneficiaryAccount.currency === '₦') {
  //           if (fundsTransferred > userAccount.account_balance) throw new HttpException(StatusCodes.BAD_REQUEST, 'Insufficient Funds!! Please enter an amount less than your account balance');
          
  //           const bankCharges = {
  //               sameBank: { low: 30.00, high: 60.00 },
  //               differentBank: { low: 40.00, high: 80.00 }
  //           };
            
  //           const chargeCategory = userAccount.bank_name === beneficiaryAccount.bank_name ? 'sameBank' : 'differentBank';
  //           transactionData.bank_charges = fundsTransferred < 50000.00 ? bankCharges[chargeCategory].low : bankCharges[chargeCategory].high;

  //           await this.updateAccount(userAccount, beneficiaryAccount, fundsTransferred, transactionData.bank_charges);
  //       } else {
  //           transactionData.bank_charges = fundsTransferred < 10000.00 ? 50.00 : 100.00;
  //           await this.updateAccount(userAccount, beneficiaryAccount, fundsTransferred, transactionData.bank_charges);
  //       }
  //   }
  // }
    
}


















        // if (findUserBankAccount.bank_name == findBeneficiaryBankAccount.bank_name && funds_transferred < 50000) transactionData.bank_charges = 30.00
        // if (findUserBankAccount.bank_name !== findBeneficiaryBankAccount.bank_name && funds_transferred < 50000) transactionData.bank_charges = 40.00
        // if (findUserBankAccount.bank_name == findBeneficiaryBankAccount.bank_name && funds_transferred > 50000) transactionData.bank_charges = 60.00
        // if (findUserBankAccount.bank_name !== findBeneficiaryBankAccount.bank_name && funds_transferred > 50000) transactionData.bank_charges = 80.00

        /*
        const createTransaction: TransactionInterface = await transactionRepository.create({ ...transactionData });
        createTransaction.userInfo = findUser;
        createTransaction.userBankAccount = findUserBankAccount;
        createTransaction.beneficiaryBankAccount = findBeneficiaryBankAccount;
        createTransaction.transaction_reference = transactionReference();
        createTransaction.amount = `${transactionData.currency}${createTransaction.funds_transferred}`;
        createTransaction.transaction_status = TRANSACTION_STATUS.COMPLETED;
        const savedTransaction = await transactionRepository.save(createTransaction);
		    return savedTransaction;
        */