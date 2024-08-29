const validCurrencySymbols: string[] = ['₦', '$', '€', '£', '¥']; // Add more symbols as needed;

const isValidCurrencySymbol = (value: string): boolean => {
    // Check if the value is in the list of valid currency symbols
    if (typeof value !== 'string') {
        return false;
    }
    
    return validCurrencySymbols.includes(value);
};

export { isValidCurrencySymbol };


/*

    "migration:generate-dev": "typeorm-ts-node-commonjs migration:generate -d src/database/data-source.ts",
    "migration:dev": "typeorm-ts-node-commonjs migration:run -d src/database/data-source.ts"

    npm run migration:generate-dev src/migrations/UserInfo


    @OneToOne(() => UserBankAccountEntity, userBankAccount=>userBankAccount.userInfo)
    userBankAccount: UserBankAccountEntity;

    @OneToOne(() => UserInfoEntity, userInfo=>userInfo.userBankAccount)
    @JoinColumn({ name: "user_id" })
    userInfo: UserInfoEntity;

    concurrently \"tsc -w\" \"nodemon build/index.js\"

    "scripts": {
    "watch": "tsc -w",
    "dev": "nodemon build/index.js",
    "start:dev": "concurrently \"tsc -w\" \"nodemon build/index.js\"",
    "build": "tsc",
    "start": "ts-node src/index.ts",
    "typeorm": "typeorm-ts-node-commonjs",
    "typeorm:cli": "ts-node ./node_modules/typeorm/cli -f ./src/database/data-source.ts",
    "migration:generate-dev": "ts-node ./node_modules/typeorm/cli.js migration:generate -d ./src/database/data-source.ts",
    "migration:run-dev": "ts-node ./node_modules/typeorm/cli.js migration:run -d ./src/database/data-source.ts"
  }

  
*/



