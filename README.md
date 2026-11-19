# Currency Converter 💱

A simple and responsive currency converter built with React, TypeScript, and Vite.

This project allows users to convert between US Dollars (USD) and Iranian Rials (IRR) using a live exchange rate or a manually entered exchange rate.

## ✨ Features

- **Two-way Conversion:** Convert USD to IRR and IRR to USD.
- **Live Exchange Rate:** Automatically fetches the USD exchange rate from an external API.
- **Manual Exchange Rate:** Users can enter their preferred USD exchange rate.
- **Automatic Updates:** The API exchange rate refreshes every 60 seconds.
- **API Fallback:** Manual exchange rate entry remains available if the API is unavailable.
- **Responsive Design:** Works on desktop and mobile devices.
- **Currency Formatting:** Displays formatted numbers for better readability.

## 🛠️ Technologies

- React
- TypeScript
- Vite
- Tailwind CSS
- Lucide React

## 🚀 Getting Started

### Prerequisites

Make sure you have Node.js and pnpm installed.

### Installation

Clone the repository:

```bash
git clone https://github.com/USERNAME/currency-converter.git
```

Navigate to the project directory:

```bash
cd currency-converter
```

Install dependencies:

```bash
pnpm install
```

### Development

Start the development server:

```bash
pnpm dev
```

### Production Build

Build the project for production:

```bash
pnpm build
```

## 💵 Exchange Rate

The application retrieves the USD exchange rate from the following API:

[ Navasan API – Fiat Exchange Rates ](https://raw.githubusercontent.com/HosseinOdd/Navasan-API/main/data/fiat.json)

The API provides exchange rates in Toman. The application converts the rate to Rial using the following formula:

```ts
const usdToRial = usdToToman * 10;
```

Users can also manually enter an exchange rate. When a custom rate is selected, the application uses that value instead of the API rate.

## 📁 Project Structure

```text
currency-converter/
├── public/
├── src/
│   ├── components/
│   ├── App.tsx
│   ├── main.tsx
│   └── ...
├── index.html
├── package.json
├── pnpm-lock.yaml
├── tsconfig.json
├── vite.config.ts
├── .gitignore
└── README.md
```

## 📝 Notes

- The exchange rate provided by the API may change over time.
- Manual exchange rate entry is available as an alternative.
- The `node_modules` and `dist` directories are excluded from the Git repository.

---

**Developed by Pouya Halavat**

---

**Languages:**

- English
- [فارسی (Persian)](README.fa.md)
