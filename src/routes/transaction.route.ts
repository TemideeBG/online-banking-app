import { Router } from 'express';
import { Routes } from '../interfaces/routes.interface';
import { authentication, authorizeRoles } from '../middleware/auth.middleware';
import { TransactionController } from '../controllers/transaction.controller';

class TransactionRoute implements Routes {
  public path = '/transaction';
  public router = Router();
  public transactionController = new TransactionController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/`, authentication, this.transactionController.createTransaction);
    this.router.get(`${this.path}/`, authentication, authorizeRoles("SUPER-ADMIN","ADMIN"), this.transactionController.getAllTransactions);
    this.router.get(`${this.path}/:transaction_id`, authentication, this.transactionController.getSingleTransaction);
    this.router.get(`${this.path}/show/users_associated_to_transactions`, authentication, this.transactionController.getUsersAssociatedToTransactions);
    this.router.delete(`${this.path}/:transaction_id`, authentication, this.transactionController.deleteTransaction);
  }
}

export default TransactionRoute;


