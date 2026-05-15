# PayFlow Frontend

PayFlow is a simulated digital wallet frontend built with React and Vite. It gives users a polished dashboard for viewing balances, sending money, requesting payments, simulating deposits, tracking transactions, and reviewing wallet analytics.

This project is intended for learning, demos, and portfolio use. No real money movement happens in the frontend.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [App Routes](#app-routes)
- [Backend API Contract](#backend-api-contract)
- [Project Structure](#project-structure)
- [Development Notes](#development-notes)
- [Troubleshooting](#troubleshooting)

## Features

- Authentication pages for login and signup
- JWT-based session handling with automatic logout on token expiry
- Protected dashboard layout with navbar and sidebar navigation
- Wallet balance summary
- Recent transaction overview
- Full transactions page with filtering and searching
- Analytics page powered by transaction data
- Send money flow with validation and toast feedback
- Request money flow that generates a shareable payment link
- Public payment request page for opening payment links
- Deposit flow with a payment simulator
- Recurring payment creation screen
- Currency preference stored locally
- Responsive dark UI built with Tailwind CSS

## Tech Stack

- React 19
- Vite 7
- React Router 7
- Tailwind CSS 3
- Axios
- Recharts
- React Hot Toast
- ESLint 9

## Getting Started

### Prerequisites

Install the following before running the app:

- Node.js 20 or newer
- npm
- A running PayFlow backend API

### Installation

Clone the repository and install dependencies:

```bash
git clone <repository-url>
cd payflow-frontend
npm install
```

Create a local environment file:

```bash
cp .env.example .env
```

Start the development server:

```bash
npm run dev
```

The app will usually be available at:

```bash
http://localhost:5173
```

## Environment Variables

| Variable | Required | Description | Example |
| --- | --- | --- | --- |
| `VITE_API_BASE_URL` | Yes | Base URL for the backend API used by Axios. | `http://localhost:8080` |

Vite only exposes environment variables that start with `VITE_`, so keep the backend URL named exactly as shown above.

## Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Starts the Vite development server. |
| `npm run build` | Builds the production bundle into `dist/`. |
| `npm run preview` | Serves the production build locally for preview. |
| `npm run lint` | Runs ESLint across the project. |

## App Routes

| Route | Access | Purpose |
| --- | --- | --- |
| `/` | Public | Redirects users to `/dashboard` or `/login` based on auth state. |
| `/login` | Public | Login form. |
| `/signup` | Public | Signup form. |
| `/pay` | Public | Payment request page opened from generated payment links. |
| `/dashboard` | Protected | Main wallet overview. |
| `/transactions` | Protected | Transaction history and filters. |
| `/analytics` | Protected | Charts and spending insights. |
| `/wallet` | Protected | Wallet balance and wallet activity. |
| `/settings` | Protected | Account/session and app preferences. |
| `/payment` | Protected | Payment simulation screen used by deposits. |
| `/recurring` | Currently public | Recurring payment creation screen. This should likely be protected. |

## Backend API Contract

The frontend expects a backend API at `VITE_API_BASE_URL`. Authenticated requests send a bearer token through the `Authorization` header:

```http
Authorization: Bearer <jwt>
```

### Auth

| Method | Endpoint | Used By | Expected Behavior |
| --- | --- | --- | --- |
| `POST` | `/users/register` | Signup | Creates a user account from `name`, `email`, and `password`. |
| `POST` | `/users/login` | Login | Returns a JWT token either as `data.token` or directly as the response body. |

### Wallet

| Method | Endpoint | Used By | Expected Behavior |
| --- | --- | --- | --- |
| `GET` | `/wallet/balance` | Dashboard, Wallet | Returns the current wallet balance. |
| `POST` | `/wallet/transfer` | Send Money modal | Transfers money to `receiverEmail` with a numeric `amount`. |

### Transactions

| Method | Endpoint | Used By | Expected Behavior |
| --- | --- | --- | --- |
| `GET` | `/transactions` | Dashboard, Transactions, Analytics, Wallet, Sidebar | Returns the current user's transactions as an array. |

### Payments

| Method | Endpoint | Used By | Expected Behavior |
| --- | --- | --- | --- |
| `POST` | `/payment/simulate` | Payment Simulator | Simulates a deposit/payment with `amount` and `method`. |
| `POST` | `/payment/request` | Request Money modal | Creates a payment request with `amount` and optional `note`; returns `paymentLink`. |
| `GET` | `/payment/request/:requestId` | Pay Request page | Returns payment request details. |
| `POST` | `/payment/pay/:requestId` | Pay Request page | Completes a payment request. |

### Recurring Payments

| Method | Endpoint | Used By | Expected Behavior |
| --- | --- | --- | --- |
| `POST` | `/recurring/create` | Recurring Payment page | Creates a recurring payment using `receiverEmail`, `amount`, and `frequency`. |

## Project Structure

```text
payflow-frontend/
|-- public/                  # Static assets
|-- src/
|   |-- api/                 # Axios client and API helpers
|   |   |-- api.js
|   |   |-- paymentApi.js
|   |   `-- walletApi.js
|   |-- components/          # Reusable UI components and modals
|   |-- context/             # Auth and currency context providers
|   |-- layouts/             # Shared application layout
|   |-- pages/               # Route-level pages
|   |-- App.jsx              # Route configuration
|   |-- main.jsx             # React app entrypoint
|   `-- index.css            # Global styles
|-- index.html
|-- package.json
|-- tailwind.config.js
`-- vite.config.js
```

## Development Notes

- The Axios client is configured in `src/api/api.js`.
- Auth state is managed in `src/context/AuthContext.jsx`.
- The JWT is stored in `localStorage` under the key `token`.
- Currency preference is stored in `localStorage` under the key `currency`.
- A `401` or `403` API response clears the local token and redirects to `/login`.
- Payment links currently open the public `/pay` route and expect a request identifier from the URL query string.
- Deposit requests navigate through `/payment?amount=<amount>` before calling the payment simulation API.

## Recommended Next Improvements

- Move `/recurring` behind the protected layout.
- Add recurring payments to the sidebar or dashboard quick actions.
- Replace `alert()` and `console.log()` in recurring payments with toast notifications.
- Fix current ESLint errors so `npm run lint` passes cleanly.
- Add basic component or integration tests for auth, dashboard loading, transfers, and payment requests.
- Remove accidental duplicate lockfiles if they are not intentionally tracked.

## Troubleshooting

### The app redirects me to login

The JWT may be missing, expired, or rejected by the backend. Log in again and check that the backend returns a valid token.

### API requests fail immediately

Check that `VITE_API_BASE_URL` is set and that the backend is running:

```bash
VITE_API_BASE_URL=http://localhost:8080
```

After changing `.env`, restart the Vite dev server.

### I see CORS errors

Enable CORS on the backend for the Vite dev origin:

```text
http://localhost:5173
```

### `npm run lint` fails

The project currently has lint issues that should be cleaned up before production use. Run:

```bash
npm run lint
```

Then fix the reported files one by one.

## Disclaimer

PayFlow is a simulated wallet interface. It is not connected to real banking rails, and it should not be used to process real payments without a complete security, compliance, and backend review.
