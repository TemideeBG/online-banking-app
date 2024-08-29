/**
 * @method isEmpty
 * @param {String | Number | Object} value
 * @returns {Boolean} true & false
 * @description this value is Empty Check
 */

import { length } from 'class-validator';
import { generate } from 'randomstring';
export const isEmpty = (value: string | number | object): boolean => {
    if (value === null) {
      return true;
    } else if (typeof value !== 'number' && value === '') {
      return true;
    } else if (typeof value === 'undefined' || value === undefined) {
      return true;
    } else if (value !== null && typeof value === 'object' && !Object.keys(value).length) {
      return true;
    } else {
      return false;
    }
  };
  
  export const generateOTP = () => {
    const suffix = generate({
      length: 6,
      charset: "numeric",
    });
    const otp =  suffix.padStart(6, "0");
    return otp;
  };

  export const generateTempPass = () => {
    const suffix = generate({
      length: 8,
      charset: "alphanumeric",
    });
    const id = suffix.padStart(8, "0");
    return id;
  };
  
  export const generateAccountNumber = () => {
    const suffix = generate({
      length: 10,
      charset: "numeric",
    });
    const id = suffix.padStart(6, "0");
    return id;
  };

  export const transactionReference = () => { 
	const prefix = "EBI-TRNX-";
	const suffix = generate({
    length: 8,
    charset: "numeric",
  });
	const ref = prefix + suffix.padStart(length, "0");
	return ref;
 };

  export const randomReferenceNumber = (prefix, len) => {
    const suffix = generate({
        length: Number(len),
		charset: "numeric",
    });
    const id = prefix + suffix.padStart(Number(len), "0");
	return id;
  };

  /*

  const generateOTP = () => {
	const otp = randomstring.generate({
		length: 6,
		charset: "numeric",
	});
	return otp.padStart(6, "0");
};

// temporary password generator
const generateTempPass = () => {
	const otp = randomstring.generate({
		length: 8,
		charset: "alphanumeric",
	});
	return otp.padStart(8, "0");
};

const generateAccountNumber = () => {
	const suffix = randomstring.generate({
		length: 10,
		charset: "numeric",
	});
	const id = suffix.padStart(10, "0");

	return id;
};

const transactionReference = () => { 
	const prefix = "ebi-trnx-";
	const suffix = Date.now();
	const ref = prefix + suffix;
	return ref;
 }

const randomReferenceNumber = (prefix, len) => {
	const suffix = randomstring.generate({
		length: Number(len),
		charset: "numeric",
	});
	const id = prefix + suffix.padStart(Number(len), "0");

	return id;
};
  */