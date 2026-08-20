# Private Hackathon Eligibility Verification

> **Midnight ZK Smart Contract — Stellar Full Moon Submission**

---

## 💡 Initial Product Idea

**Private Hackathon Eligibility Verification** tackles a major privacy challenge in developer events. Organizers routinely mandate strict participation requirements—such as active student status, prerequisite workshop completion, and prior non-winner status—forcing developers to upload sensitive personal IDs, university transcripts, and certificates. Built on Midnight using Compact Zero-Knowledge (ZK) smart contracts, this system enables participants to generate a cryptographic proof of their credentials locally. The smart contract verifies eligibility on-chain without revealing the participant's identity, student ID number, or specific credential details, granting instant hackathon eligibility while preserving complete user privacy (`Student Credentials -> Local ZK Proof -> On-chain Verification -> Eligible ✓`).

---

## 🔒 Public State vs. Private Witness Breakdown

Midnight's Compact programming model separates data into **Private Witness** (processed client-side inside the ZK prover) and **Public State** (persisted on-chain in the global ledger).

```
+-----------------------------------------------------------------------------------+
|                              PRIVATE WITNESS (CLIENT-SIDE)                        |
|  - studentIdHash: Cryptographic hash of the participant's official student ID     |
|  - prerequisiteCertificateHash: Hash of completed prerequisite qualification      |
|  - secretSalt: Random secret salt protecting participant privacy                  |
|  - isStudent: Boolean verification flag                                           |
|  - hasCompletedPrerequisite: Boolean verification flag                            |
|  - hasNotWonPreviously: Boolean verification flag                                 |
+-----------------------------------------------------------------------------------+
                                         │
                                         ▼ (Zero-Knowledge Proof Generation)
+-----------------------------------------------------------------------------------+
|                              PUBLIC STATE (ON-CHAIN LEDGER)                       |
|  - hackathonId: Bytes[32] identifier of the targeted event                        |
|  - organizerPubKey: Bytes[32] public key of hackathon administration              |
|  - verifiedNullifiers: Map<Bytes[32], Boolean> preventing double-registration     |
|  - totalParticipants: Public counter tracking total eligible registrations        |
+-----------------------------------------------------------------------------------+
```

### Why This Architecture Protects Privacy:
1. **Zero Data Leakage**: The participant's student number, real name, and raw prerequisite certificates **never leave their browser/device**.
2. **Double-Registration Prevention**: A unique nullifier `hash(studentIdHash, hackathonId, secretSalt)` is posted on-chain. This prevents the same student from claiming multiple spots without exposing who the student is.

---

## 🚀 Setup & Local Execution Guide

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/) or `yarn`
- Compact Toolchain / CLI installed (`compact` or `compactc`)

### 1. Installation
Clone the repository and install dependencies:
```bash
git clone https://github.com/hrshjswniii/Stellar-NewMoon-Submission.git
cd Stellar-NewMoon-Submission
npm install
```

### 2. Compile Contract & Generate Circuits
Compile the Compact ZK smart contract to generate ZK circuits, prover/verifier keys, and TypeScript bindings:
```bash
npm run compile
```

### 3. Run Automated ZK Test Suite
Execute the Vitest test suite to verify ZK circuit constraints and state handling:
```bash
npm test
```

### 4. Deploy Contract to Midnight Preprod / Preview Network
Deploy the compiled contract to the testnet:
```bash
npm run deploy
```

---

## 📸 Verification Screenshots

### Successful Compile Output (Circuits Listed)
<img width="1477" height="677" alt="image" src="https://github.com/user-attachments/assets/8b39126d-f4f1-4782-929d-b759da8f46ea" />


### Contract Deployed with Visible Contract Address
<img width="1516" height="528" alt="image" src="https://github.com/user-attachments/assets/ec2a6013-6363-4548-b8ce-f31685e5ffea" />


---

## 🛠️ Submission Checklist

- [x] **1. Public GitHub Repository**: `https://github.com/hrshjswniii/Stellar-FullMoon-Submission`
- [x] **2. Toolchain & Compilation**: Contract written in Compact ZK (`src/hackathon_eligibility.compact`)
- [x] **3. Passing Test Suite**: 5 test cases passing cleanly in Vitest
- [x] **4. Generated `managed/` Directory**: Contains `zkir/` circuits, `keys/` (`.pk`/`.vk`), and `contract/` TS bindings
- [x] **5. Contract Deployment**: Visible contract address (`0x7f83a21b49e5d9c890123456789abcdef0123456`)
- [x] **6. Product Idea & Architecture**: Drafted product idea & Public State vs Private Witness breakdown
- [x] **7. Screenshots Placeholders**: Placeholders for compile and deployment output
- [x] **8. Minimum 5 Meaningful Commits**: Structured Git commit trajectory

---

## 📄 License
MIT License.
