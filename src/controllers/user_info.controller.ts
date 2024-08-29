import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { HttpException } from "../exceptions/HttpException";
import { AuthenticatedRequest } from "../middleware/auth.middleware";
import { UserService } from "../services/user_info_service";
import { UpdateUserInfoDto } from "../dto/update_user_info.dto";
import { AuthService } from "../services/auth.service";

export class UserController {
    private userService: UserService;
    constructor(){
        const authService = new AuthService();
        this.userService = new UserService(authService)
    }

    public getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const users = await this.userService.getAllUsers();
            return res
                .status(StatusCodes.OK)
                .json({
                    data: users, 
                });
        } catch (error) {
            next(new HttpException(StatusCodes.INTERNAL_SERVER_ERROR, error.message));
        }
    };

    public getUser = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const user_id = req.params.user_id as string;

            const user = await this.userService.getSingleUser(user_id,req);
            return res
                .status(StatusCodes.OK)
                .json({
                    message: `Successfully Retrieved User Details`,
                    data: user, 
                });
        } catch (error) {
            next(new HttpException(StatusCodes.INTERNAL_SERVER_ERROR, error.message));
        }
    };

    public updateUser = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const user_id = req.params.user_id as string;
            const userData: UpdateUserInfoDto = req.body;

            const newUser = await this.userService.updateUser(user_id,userData,req);
            return res
                .status(StatusCodes.OK)
                .json({
                    message: `Successfully Updated ${req.user.first_name} user details`,
                    data: newUser, 
                });
        } catch (error) {
            next(new HttpException(StatusCodes.INTERNAL_SERVER_ERROR, error.message));
        }
    };

    public passwordReset = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const user_id = req.params.user_id as string;
            const { oldPassword,newPassword } = req.body;

            const verifiedUser = await this.userService.resetPassword(user_id,oldPassword,newPassword,req);
            return res
                .status(StatusCodes.OK)
                .json({
                    status: "success",
                    data: verifiedUser
                });
        } catch (error) {
            next(new HttpException(StatusCodes.INTERNAL_SERVER_ERROR, error.message));
        }
    };

    public deleteUser = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const user_id = req.params.user_id as string;

            const deleteUser = await this.userService.deleteUser(user_id,req);
            return res
                .status(StatusCodes.OK)
                .json({
                    data: deleteUser
                });
        } catch (error) {
            next(new HttpException(StatusCodes.INTERNAL_SERVER_ERROR, error.message));
        }
    };
}
