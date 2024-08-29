import { Router } from 'express';
import { Routes } from '../interfaces/routes.interface';
import { authentication, authorizeRoles } from '../middleware/auth.middleware';
import { UserBankAccountController } from '../controllers/user_bank_account.controller';

class UserBankAccountRoute implements Routes {
  public path = '/user_bank_account';
  public router = Router();
  public userBankAccountController = new UserBankAccountController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/`, authentication, this.userBankAccountController.createUserBank);
    this.router.get(`${this.path}/`, authentication, authorizeRoles("SUPER-ADMIN","ADMIN"), this.userBankAccountController.getAllUsersBankAccounts);
    this.router.get(`${this.path}/:userBank_id`, authentication, this.userBankAccountController.getUserBankAccount);
    this.router.delete(`${this.path}/:userBank_id`, authentication, authorizeRoles("SUPER-ADMIN"), this.userBankAccountController.deleteUserBank);
  }
}

export default UserBankAccountRoute;


