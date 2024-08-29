import { Router } from 'express';
import { Routes } from '../interfaces/routes.interface';
import { AuthController } from '../controllers/auth.controller';
import { authentication, authorizeRoles } from '../middleware/auth.middleware';

class AuthRoute implements Routes {
  public path = '/auth';
  public router = Router();
  public authController = new AuthController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/signup`, this.authController.userSignUp);
    this.router.post(`${this.path}/login`, this.authController.login);
    this.router.post(`${this.path}/admin/signup`, authentication, authorizeRoles("SUPER-ADMIN"), this.authController.adminSignUp);
    this.router.post(`${this.path}/validate/otp`, this.authController.verifyOtp);
    this.router.post(`${this.path}/resend/otp`, this.authController.resendOtp);
    this.router.post(`${this.path}/verify/email`, this.authController.verifyEmail);
    //this.router.post(`${this.path}/admin/signup`,authentication, authorizeRoles("super-admin"), this.authController.adminSignup);
    //this.router.get(`${this.path}/logout`, this.authController.logout);
  }
}

export default AuthRoute;


