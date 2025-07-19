# 🌿 CropSure – Decentralized Crop Insurance & Disaster Relief Platform

CropSure is a Web3 project that leverages blockchain and smart contracts to deliver transparent, fast, and fair crop insurance and disaster relief for small-scale farmers.

## 🚜 Real-World Problem

Millions of small farmers worldwide are vulnerable to:
- Climate change (droughts, floods, pest outbreaks)
- Delayed or fraudulent insurance payouts
- Lack of access to financial relief during crises

CropSure solves this by providing:
- Parametric insurance powered by oracles (e.g. rainfall thresholds)
- Farm identity tokens to verify farmer participation
- A donor-backed disaster relief fund governed by a DAO

---

## 🔗 Core Smart Contracts

### 1. `FarmIdentity.sol`
ERC-721 NFT contract that registers a farmer's land and crop details.
- Includes GPS coordinates, land size, crop type, and season dates
- Required to access insurance and relief funds

### 2. `CropInsurance.sol`
Parametric insurance contract:
- Farmers pay premiums
- Uses external oracles to monitor weather conditions
- Auto-triggers payouts if certain thresholds are breached (e.g., no rain for 30 days)

### 3. `ReliefPool.sol`
Disaster relief pool funded by donors:
- Activated when mass crop failure or weather events occur
- DAO-style voting system for fund allocation
- Transparency for all transactions and disbursements

---

## 🧱 Tech Stack

- Solidity (Smart Contracts)
- Hardhat (Dev Environment)
- Chainlink (Weather Oracles)
- IPFS or Filecoin (Metadata Storage)
- React / Next.js (Frontend - optional)
- Ethers.js / Wagmi (Web3 integration)

---

## 🚀 Getting Started

### Prerequisites

- Node.js ≥ 16.x
- Hardhat (`npm install --save-dev hardhat`)
- MetaMask or any Web3 wallet

### Installation

```bash
git clone https://github.com/yourusername/cropsure.git
cd cropsure
npm install
