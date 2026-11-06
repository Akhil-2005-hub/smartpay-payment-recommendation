# SmartPay — Payment Fee Comparison Dashboard

SmartPay is a responsive frontend demo for comparing estimated payment fees, GST, cashback, and net payable amounts across popular Indian payment apps. It includes comparison views for mobile recharge, electricity, DTH, and credit card bills, plus sample transaction and analytics screens.

> **Demo data:** Fee rules, promotions, provider ratings, success rates, plans, and sample bill lookups are illustrative data coded into the app. They are not live offers, official provider quotes, or financial advice. Confirm current charges with the payment provider before paying.

## Features

- Compare estimated total costs across eight payment platforms.
- Explore mobile, electricity, DTH, and credit card bill examples.
- Review demo transaction history and summary charts.
- Switch between light and dark themes.
- Use the responsive dashboard on desktop and mobile.

## Built with

React, TypeScript, Vite, Tailwind CSS, React Router, Recharts, Lucide, and Motion.

## Requirements

- Node.js 20.19+ or 22.12+ (Vite 8 requirement)
- npm

## Run locally

```bash
npm install
npm run dev
```

Open the local URL printed by Vite (normally `http://localhost:3000`). No API key or `.env` file is required.

## Checks

```bash
npm run lint
npm test
npm run build
```

## Project structure

```text
src/
  components/   Reusable dashboard and service UI
  context/      Theme and transaction state
  data/         Demo providers, plans, and transactions
  pages/        Dashboard routes
  utils/        Fee calculations and tests
```

## Notes and limitations

- This is a client-side demonstration; it does not process payments or retrieve live bills.
- Recommendations are calculated from editable sample rules, not real-time provider APIs.
- Some provider plan details and promotional values may be outdated or fictional.
- Do not enter real account, card, or bill credentials.

## License

No license is currently included. Add a license file before accepting contributions or granting reuse rights.

