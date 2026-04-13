# EfikCoin Eternal – Official Wallet

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub Pages](https://img.shields.io/badge/GitHub-Pages-blue)](https://efikcoin-eternal-blockchain.github.io/ECE-Wallet/)
[![PWA](https://img.shields.io/badge/PWA-Installable-brightgreen)](https://efikcoin-eternal-blockchain.github.io/ECE-Wallet/)
[![Contract Verified](https://img.shields.io/badge/Contract-Verified-success)](https://bscscan.com/address/0x9F8C29E496ECB6C39c221458f211234DfCB233E0)

**EfikCoin Eternal (ECE)** is a decentralized finance (DeFi) ecosystem on Binance Smart Chain. This repository contains the **official web wallet and dApp** – a Progressive Web App (PWA) that works on desktop and mobile, and can be installed as a native app.

---

## 🌟 Live Wallet

**URL:** [https://efikcoin-eternal-blockchain.github.io/ECE-Wallet/](https://efikcoin-eternal-blockchain.github.io/ECE-Wallet/)

- **Install on Android:** Open in Chrome → “Add to Home Screen” / “Install app”.
- **Install on iOS:** Open in Safari → share icon → “Add to Home Screen”.

---

## 🔥 Features

| Category | Details |
|----------|---------|
| **Wallet** | Create new wallet (12‑word seed phrase) or import existing (seed/private key). Password protection. |
| **Staking** | Lock ECE for 30–365 days, earn up to **750% APR**, claim rewards. |
| **Airdrop** | Owner‑only tool – distribute tokens via CSV upload or manual entry. |
| **Loans** | Request loans in ECE, BNB, USDT, BTC, or ETH; admin approval with email notifications. |
| **Transaction History** | Real‑time token transfers from BscScan API. |
| **Contract Interaction** | Read functions (name, symbol, total supply, balance, owner) and write (transfer, approve). |
| **Buy / Sell** | Direct links to PancakeSwap + embedded swap widget. |
| **Deposit / Withdraw** | Deposit via QR code or address; send ECE or native tokens with transaction status. |
| **Referral System** | Each user gets a unique referral link to grow the community. |
| **Live Chart** | TradingView widget with real‑time price data. |
| **Multi‑language** | 12 languages (auto‑detect + manual selector). |
| **Admin Panel** | Visible only to contract owner – mint tokens, set pair, withdraw fees, broadcast messages, view user messages. |
| **Support Chat** | Users can message admin; admin replies via dedicated admin panel. |
| **PWA Ready** | Manifest + service worker → installable on any device. |

---

## 📦 Smart Contract

- **Contract Address (BSC):** `0x9F8C29E496ECB6C39c221458f211234DfCB233E0`
- **Explorer:** [BscScan](https://bscscan.com/address/0x9F8C29E496ECB6C39c221458f211234DfCB233E0)
- **Decimals:** 18
- **Total Supply:** 1,000,000,000 ECE (mintable by owner)

---

## 🚀 Quick Start (Local Development)

1. **Clone the repository**
   ```bash
   git clone https://github.com/efikcoin-eternal-blockchain/ECE-Wallet.git
   cd ECE-Wallet
# Efikcoin Eternal – Renaming & Version Update Log

This document tracks the official renaming and version changes for the **Efikcoin Eternal** project (formerly known as Efikcoin Legacy / ECE Beta).

---

## 🔄 Current Official Names

| Component | Old Name (if any) | New Name (current) |
|-----------|------------------|---------------------|
| Token | Efikcoin Legacy (EFL) | **Efikcoin Eternal (ECE)** |
| Wallet | Efikcoin Classic Wallet | **ECE Wallet** |
| Blockchain Browser | Efikcoin Portal | **Efikcoin Eternal Engine Browser** |
| RPC Endpoint | – | **ECE Custom RPC (Tenderly)** |
| Banking System | – | **Efikcoin Eternal Banking Wallet** |

---

## 📅 Update Timeline

- **2026-04-06 23:32** – Token contract deployed on BNB Smart Chain  
  `0x9F8C29E496ECB6C39c221458f211234DfCB233E0`
- **2026-04-10** – Wallet & website launched on GitHub Pages
- **2026-04-13** – Project renamed to **Efikcoin Eternal**  
  - Repositories moved to `efikcoin-eternal-blockchain` and `efikcoineternal` orgs
  - Engine browser and banking system initiated

---

## 🧩 Why the rename?

To reflect the project’s mission: **an eternal, unstoppable ecosystem** built by a single developer using DeepSeek AI. The name "Eternal" signifies:
- No central authority shutdown
- Immutable smart contracts
- Permanent IPFS hosting for frontend

---

## 🔧 How to update your local references

If you have cloned old repositories, update these files:

### 1. `package.json`
```json
"name": "efikcoin-eternal-banking-wallet",
"description": "Live wallet & banking system for Efikcoin Eternal (ECE)"
