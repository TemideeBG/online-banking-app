import { AppDataSource } from "../database/data-source";
import { UserInfoInterface } from "../interfaces/user_info.interface";
import userAge from "../utils/getUserAge";
import * as bcrypt from 'bcrypt';
import { BadRequestError } from "../errors";
import { StatusCodes } from "http-status-codes";
import { HttpException } from "../exceptions/HttpException";
import { UserInfoEntity } from "../entities/user_info.entity";
import { isEmpty } from "../utils/random_string";
import { AuthenticatedRequest } from "../middleware/auth.middleware";
import { AuthService } from "./auth.service";
import { USER_ROLES } from "../enums/USER_ROLES.enum";
import { UpdateUserInfoDto } from "../dto/update_user_info.dto";

export class UserService {
    public users = UserInfoEntity;
    constructor(private readonly authService: AuthService){}

    public async getAllUsers(): Promise<UserInfoInterface[]> {
        //if (isEmpty(otp)) throw new BadRequestError("Please provide the required otp");
        const userRepository = AppDataSource.getRepository(this.users);
        const allUsers = await userRepository.find();
        if(!allUsers) throw new HttpException(StatusCodes.NOT_FOUND, 'Users not found!!');
        return allUsers;
    };

    public async getSingleUser(user_id:string, req:AuthenticatedRequest): Promise<any> {
        if (isEmpty(user_id)) throw new BadRequestError("Please provide the required userId");
        const userRepository = AppDataSource.getRepository(this.users);
        const user = await userRepository.findOne({ where: { id: user_id } });
        if(!user) throw new HttpException(StatusCodes.NOT_FOUND, 'User not found!!Please enter valid user id');
        const sanitizeduser = await this.authService.sanitizeUser(user);
        const hasSuperAdminRole = req.user.role.includes(USER_ROLES.SUPER_ADMIN);
        const hasAdminRole = req.user.role.includes(USER_ROLES.ADMIN);
        //console.log(client.businessOwner.id, req.user.id, hasAdminRole);
  
        if (user.id !== req.user.id && !hasSuperAdminRole && !hasAdminRole) throw new HttpException(StatusCodes.UNAUTHORIZED,'You do not have permission to retrieve client information')
        return sanitizeduser;
    };

    public async resetPassword(user_id:string, oldPassword:string, newPassword:string, req:AuthenticatedRequest): Promise<any> {
        if (isEmpty({oldPassword,newPassword})) throw new BadRequestError("Please provide the required old and new passwords");
        const userRepository = AppDataSource.getRepository(this.users);
        const user = await userRepository.findOne({ where: { id: user_id } });
        if(!user) throw new HttpException(StatusCodes.NOT_FOUND, 'User not found!!Please enter valid user id');
        const isValidPassword = await bcrypt.compare(oldPassword,user.password);
        if(!isValidPassword) throw new HttpException(StatusCodes.NOT_FOUND, 'User Password Incorrect!!Please enter valid user password');
        
        const hasSuperAdminRole = req.user.role.includes(USER_ROLES.SUPER_ADMIN);
        const hasAdminRole = req.user.role.includes(USER_ROLES.ADMIN);
        if (user.id !== req.user.id && !hasSuperAdminRole && !hasAdminRole) throw new HttpException(StatusCodes.UNAUTHORIZED,'You do not have permission to reset user password')
        const newHashedPassword = await bcrypt.hash(newPassword,10);
        user.password = newHashedPassword;
        await userRepository.save(user);
        return { msg: `Successfully Updated: ${user.first_name} ${user.last_name} Password` };  
    };

    public async updateUser(user_id:string, updateUserDto:UpdateUserInfoDto, req:AuthenticatedRequest): Promise<any> {
        if (isEmpty(updateUserDto)) throw new BadRequestError("Please provide the required user info to update");
        const userRepository = AppDataSource.getRepository(this.users);
        const userToUpdate = await userRepository.findOne({ where: { id: user_id } });
        if(!userToUpdate) throw new HttpException(StatusCodes.NOT_FOUND, 'User not found!!Please enter valid user id');
        const hasSuperAdminRole = req.user.role.includes(USER_ROLES.SUPER_ADMIN);
        const hasAdminRole = req.user.role.includes(USER_ROLES.ADMIN);
        if (userToUpdate.id !== req.user.id && !hasSuperAdminRole && !hasAdminRole) throw new HttpException(StatusCodes.UNAUTHORIZED,'You do not have permission to update user details')
        // Update the user's properties with provided data from updateUserDto
        if(updateUserDto.role && updateUserDto.role !== userToUpdate.role && !hasSuperAdminRole) throw new HttpException(StatusCodes.UNAUTHORIZED,'You do not have permission to change user role')
        Object.assign(userToUpdate, updateUserDto);
        userToUpdate.age = userAge(userToUpdate.date_of_birth);
        const newUserToUpdate = await userRepository.save(userToUpdate);
        return this.authService.sanitizeUser(newUserToUpdate);   
    };

    public async deleteUser(user_id: string, req:AuthenticatedRequest) {
        if (isEmpty(user_id)) throw new BadRequestError("Please provide the required userId");
        const userRepository = AppDataSource.getRepository(this.users);
        const userToDelete = await userRepository.findOne({ where: { id:user_id } });
        if (!userToDelete) throw new HttpException(StatusCodes.NOT_FOUND, 'User not found!!Please enter valid user id');
        const hasSuperAdminRole = req.user.role.includes(USER_ROLES.SUPER_ADMIN);
        //console.log(client.businessOwner.id, req.user.id, hasAdminRole);
      
        if (userToDelete.id !== req.user.id && !hasSuperAdminRole) throw new HttpException(StatusCodes.UNAUTHORIZED,'You do not have permission to delete user')
        await userRepository.remove(userToDelete);
        return { msg: `user: ${userToDelete.first_name} ${userToDelete.last_name} Successfully Deleted` };     
      };
}