# Electricity Bill Service

This project is an electricity billing service that allows users to create bills, pay them, and receive SMS notifications for various events such as bill creation, payment success, and low wallet balance.

---

# Electricity Bill Service API Endpoints

This document provides a list of available API endpoints for the Electricity Bill Service.

## Wallet Endpoints

- **Add Funds to Wallet**  
  `POST /wallets/add-funds`  
  [https://electricity-bill-service.onrender.com/wallets/add-funds](https://electricity-bill-service.onrender.com/wallets/add-funds)

- **Get Wallet Information**  
  `GET /wallets`  
  [https://electricity-bill-service.onrender.com/wallets](https://electricity-bill-service.onrender.com/wallets)

## Electricity Endpoints

- **Verify Electricity Bill**  
  `POST /electricity/verify`  
  [https://electricity-bill-service.onrender.com/electricity/verify](https://electricity-bill-service.onrender.com/electricity/verify)  

  ### Request Body
  ```json
  {
      "amount": 5000,
      "meterNumber": "HHATEBN",
      "provider": "A"
  }

- **Pay Electricity Bill**  
  `POST /electricity/Vend/:validationRef/pay`  
  [https://electricity-bill-service.onrender.com/electricity/Vend/:validationRef/pay](https://electricity-bill-service.onrender.com/electricity/Vend/:validationRef/pay)

## Bill Endpoints

- **Get Bills by User ID**  
  `GET /bills/user/:userId`  
  [https://electricity-bill-service.onrender.com/bills/user/:userId](https://electricity-bill-service.onrender.com/bills/user/:userId)

- **Get Bill by ID**  
  `GET /bills/:id`  
  [https://electricity-bill-service.onrender.com/bills/:id](https://electricity-bill-service.onrender.com/bills/:id)

## Authentication Endpoints

- **Register User**  
  `POST /auth/register`  
  [https://electricity-bill-service.onrender.com/auth/register](https://electricity-bill-service.onrender.com/auth/register)

- **Login User**  
  `POST /auth/login`  
  [https://electricity-bill-service.onrender.com/auth/login](https://electricity-bill-service.onrender.com/auth/login)

