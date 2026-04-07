import API from "./api";

export const getBalance = () =>
  API.get("/wallet/balance");

export const getTransactions = () =>
  API.get("/transactions");
