# Online Banking App Schema Design

## User Story

- The Online Banking Application is a comprehensive platform designed to facilitate seamless and secure financial transactions between users and their beneficiaries. 
- It allows users to manage their personal and banking information, create and maintain multiple bank accounts, and conduct various financial transactions with ease.
- The main objective of this project is to create an elementary implementation of an online banking application, which are heavily used by present-day banking organizations world-wide. 
- By studying examples from real world running instances of e-banking application, this thesis tried to achieve the characteristics and functionalities of a typical web based online banking software.
- Using popular frameworks and technologies in the web development field such as Typescript, React, Express, PostgreSQL and many more.
- The project combines common features of a web applications, such as login-logout registration, user-based data management and interactions with basic financial solutions that the normal user can expect from a real-world banking website such as view simulated financial data about account, conducting transactions and view bank statements.


## Requirement Analysis

- Users should be fill in the form with validated data to create a User Account.
- User fill in the form with validated data to be able to access protected resources of the application.
- User clicks the Logout button to destroy the session and revoking his rights to access protected resources.
- User must login if he wishes to access protected resources of the application. This is done using session ID and/or user ID.
- User can view and edit his User Information.
- User can perform a financial transaction by fill in a form with validated data.
- User can see his balance changed and new transactions if he is involved in a financial transaction.
- User can list all the Financial Transaction records that related to him


### Entities:

- Authentication: This allows for registering and enabling users login to their account and also logging out.
- Admin Roles: An admin/super-admin is also a user that has a unique identifier, name, email, password, role amongst other features that enjoys special admin privileges.
- User: A User has a unique identifier, name, email, password amongst other features.
- User_Bank_Account: These are the bank accounts owned and created by the users.
- Beneficiary_Bank_Account: This provides statistical data and bank accounts for beneficiaries associated to a user.
- Transaction: This shows all the payment records the user made to his beneficiary accounts.

```