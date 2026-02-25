import API from "./api";

export const simulatePayment = (amount, method) =>
  API.post("/payment/simulate", {
    amount,
    method,
  });