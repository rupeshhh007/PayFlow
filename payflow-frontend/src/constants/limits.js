export const PAYMENT_LIMITS = {
  MIN_AMOUNT: 0.01,
  MAX_AMOUNT: 1000000,
};

export const VALIDATION = {
  MIN_PASSWORD_LENGTH: 8,
  MAX_PASSWORD_LENGTH: 128,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
};

export const TIMEOUTS = {
  REDIRECT_DELAY_MS: 2000,
  API_TIMEOUT_MS: 30000,
};

export const API_ENDPOINTS = {
  LOGIN: "/users/login",
  REGISTER: "/users/register",
  REQUEST_PAYMENT: "/payment/request",
  PAY_PAYMENT: "/payment/pay",
  CREATE_RECURRING: "/recurring/create",
  SIMULATE_PAYMENT: "/payment/simulate",
  GET_BALANCE: "/wallet/balance",
  TRANSFER: "/wallet/transfer",
  GET_TRANSACTIONS: "/wallet/transactions",
};
