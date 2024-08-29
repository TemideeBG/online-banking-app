import { Router } from 'express';
import { Routes } from '../interfaces/routes.interface';
import { authentication, authorizeRoles } from '../middleware/auth.middleware';
import { UserController } from '../controllers/user_info.controller';

class UserRoute implements Routes {
  public path = '/user_info';
  public router = Router();
  public userController = new UserController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/`, authentication, authorizeRoles("ADMIN","SUPER-ADMIN"), this.userController.getAllUsers);
    this.router.get(`${this.path}/:user_id`, authentication, this.userController.getUser);
    this.router.put(`${this.path}/:user_id`, authentication, this.userController.updateUser);
    this.router.put(`${this.path}/:user_id/user-password`, authentication, this.userController.passwordReset);
    this.router.delete(`${this.path}/:user_id`, authentication, authorizeRoles("SUPER-ADMIN"), this.userController.deleteUser);
  }
}

export default UserRoute;


