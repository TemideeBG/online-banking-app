import { CustomAPIError } from '../errors';

const userAge = (birthYear: Date): number => {
    const today = new Date();
    const birthDate = new Date(birthYear);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }

    if (isNaN(age) || age < 0) {
        // Throw a custom error if the age is not a valid number
        throw new CustomAPIError('Invalid birth year provided.');
    }

    return age;
};

export default userAge;
