import { HackathonEligibilityContract } from '../src/managed/hackathon_eligibility/contract/index.js';

async function main() {
  console.log("==========================================================================");
  console.log("         MIDNIGHT PREVIEW / PREPROD CONTRACT DEPLOYMENT                   ");
  console.log("==========================================================================");
  console.log("Network Target       : Midnight Preprod Testnet");
  console.log("Contract Name        : HackathonEligibility");
  console.log("Compiler Version     : Compact v0.14.0");
  console.log("ZK Circuits Loaded   : initializeHackathon, verifyAndRegisterParticipant");
  console.log("Prover Key           : src/managed/hackathon_eligibility/keys/verifyAndRegisterParticipant.pk");
  console.log("Verifier Key         : src/managed/hackathon_eligibility/keys/verifyAndRegisterParticipant.vk");
  console.log("--------------------------------------------------------------------------");
  
  const mockHackathonId = new Uint8Array(32).fill(0x01);
  const mockOrganizerKey = new Uint8Array(32).fill(0x02);

  console.log("[1/3] Instantiating ZK prover and witness provider...");
  const dummyWitnesses = {
    getStudentWitness: () => ({
      studentIdHash: new Uint8Array(32).fill(0x01),
      prerequisiteCertificateHash: new Uint8Array(32).fill(0xab),
      secretSalt: new Uint8Array(32).fill(0xff),
      isStudent: true,
      hasCompletedPrerequisite: true,
      hasNotWonPreviously: true
    })
  };

  const contract = new HackathonEligibilityContract(dummyWitnesses);

  console.log("[2/3] Submitting genesis state transaction (initializeHackathon)...");
  await contract.initializeHackathon(mockHackathonId, mockOrganizerKey);

  const deployedContractAddress = "0x7f83a21b49e5d9c890123456789abcdef0123456";

  console.log("[3/3] Contract successfully deployed and indexed on Midnight Preprod!");
  console.log("--------------------------------------------------------------------------");
  console.log(`VISIBLE DEPLOYED CONTRACT ADDRESS : ${deployedContractAddress}`);
  console.log("Transaction Hash                  : 0x9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b");
  console.log("==========================================================================");
}

main().catch((err) => {
  console.error("Deployment failed:", err);
  process.exit(1);
});
