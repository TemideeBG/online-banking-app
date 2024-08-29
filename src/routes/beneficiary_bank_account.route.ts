import { Router } from 'express';
import { Routes } from '../interfaces/routes.interface';
import { authentication, authorizeRoles } from '../middleware/auth.middleware';
import { BeneficiaryBankAccountController } from '../controllers/beneficiary_bank_account_controller';

class BeneficiaryBankAccountRoute implements Routes {
  public path = '/beneficiary_bank_account';
  public router = Router();
  public beneficiaryBankAccountController = new BeneficiaryBankAccountController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/`, authentication, this.beneficiaryBankAccountController.createBeneficiaryBankAccount);
    this.router.get(`${this.path}/`, authentication, authorizeRoles("SUPER-ADMIN","ADMIN"), this.beneficiaryBankAccountController.getAllBeneficiariesBankAccounts);
    this.router.get(`${this.path}/:beneficiary_bank_id`, authentication, this.beneficiaryBankAccountController.getBeneficiaryBankAccount);
    this.router.get(`${this.path}/show/users_associated_to_beneficiary`, authentication, this.beneficiaryBankAccountController.getUsersAssociatedToBeneficiaries);
    this.router.delete(`${this.path}/:beneficiary_bank_id`, authentication, this.beneficiaryBankAccountController.deleteBeneficiaryBank);
  }
}

export default BeneficiaryBankAccountRoute;


