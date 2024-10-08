import { AppDataSource } from "./database/data-source";
import * as express from "express";
import * as dotenv from "dotenv";
import "reflect-metadata";
import errorHandlerMiddleware from "./middleware/error.middleware";

import AuthRoute from './routes/auth.route';
import UserRoute from "./routes/user_info.route";
import UserBankAccountRoute from "./routes/user_bank_account.route";
import BeneficiaryBankAccountRoute from "./routes/beneficiary_bank_account.route";
import TransactionRoute from "./routes/transaction.route";

dotenv.config();

const app = express();
app.use(express.json());

const { PORT = 5000 } = process.env;

// Define your routes

const authRoute = new AuthRoute();
const userRoute = new UserRoute();
const userBankAccountRoute = new UserBankAccountRoute();
const beneficiaryBankAccountRoute = new BeneficiaryBankAccountRoute();
const transactionRoute = new TransactionRoute();

app.get("/api/v1", (req, res) => {
  res.json({
      message: "ONLINE-BANKING APP V1, [Health check::: API up and running]",
      postmanLink: "https://galactic-resonance-793427.postman.co/workspace/shopping-cart-~9a5e7afb-f90e-45ee-9a95-a083095a36e2/collection/26636754-d2c69bef-bc21-4064-b743-6194010cd166?action=share&creator=26636754"
  })
});

// Use your routes

app.use('/api/v1', authRoute.router);
app.use('/api/v1', userRoute.router);
app.use('/api/v1', userBankAccountRoute.router);
app.use('/api/v1', beneficiaryBankAccountRoute.router);
app.use('/api/v1', transactionRoute.router);

app.use(errorHandlerMiddleware);

app.get('/', (req, res) => {
    return res.json('Established connection!');
  });
  
  AppDataSource.initialize()
    .then(async () => {
      app.listen(PORT, () => {
        console.log("Server is running on http://localhost:" + PORT);
      });
      console.log("Data Source has been initialized!");
    })
    .catch((error) => console.log(error));




