import { USER_ROLES } from "../enums/USER_ROLES.enum";
import { VERIFICATION_STATUS } from "../enums/VERIFICATION_STATUS.enum";

export interface UserInfoInterface {
    id: string;
    first_name: string;
    last_name: string;
    full_name?: string;
    email: string;
    password: string;
    role: USER_ROLES;
    phone_number: string;
    nationality: string;
    home_address: string;
    state_of_residence: string;
    country_of_residence: string;
    gender: string;
    date_of_birth: Date;
    age: number;
    verification_status: VERIFICATION_STATUS;
    otp: number;
  };