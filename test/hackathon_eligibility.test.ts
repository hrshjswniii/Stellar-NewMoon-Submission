import { describe, it, expect, beforeEach } from 'vitest';
import { HackathonEligibilityContract, VerificationStatus, StudentWitness } from '../src/managed/hackathon_eligibility/contract/index.js';

describe('Private Hackathon Eligibility ZK Contract Test Suite', () => {
  let contract: HackathonEligibilityContract;
  const mockPrerequisiteHash = new Uint8Array(32).fill(0xab);
  const mockHackathonId = new Uint8Array(32).fill(0x01);
  const mockOrganizerKey = new Uint8Array(32).fill(0x02);

  const createMockWitness = (overrides?: Partial<StudentWitness>): StudentWitness => ({
    studentIdHash: new Uint8Array(32).fill(0x77),
    prerequisiteCertificateHash: mockPrerequisiteHash,
    secretSalt: new Uint8Array(32).fill(0x99),
    isStudent: true,
    hasCompletedPrerequisite: true,
    hasNotWonPreviously: true,
    ...overrides
  });

  beforeEach(async () => {
    let currentWitness = createMockWitness();
    contract = new HackathonEligibilityContract({
      getStudentWitness: () => currentWitness
    });
    await contract.initializeHackathon(mockHackathonId, mockOrganizerKey);
  });

  it('1. Successfully verifies eligible student with valid ZK proof witness', async () => {
    const status = await contract.verifyAndRegisterParticipant(mockPrerequisiteHash);
    expect(status).toBe(VerificationStatus.Eligible);
    expect(contract.totalParticipants).toBe(1);
  });

  it('2. Prevents double registration replay using same student credentials nullifier', async () => {
    // First registration
    const status1 = await contract.verifyAndRegisterParticipant(mockPrerequisiteHash);
    expect(status1).toBe(VerificationStatus.Eligible);

    // Second attempt with same student nullifier
    const status2 = await contract.verifyAndRegisterParticipant(mockPrerequisiteHash);
    expect(status2).toBe(VerificationStatus.AlreadyRegistered);
    expect(contract.totalParticipants).toBe(1); // Count remains 1
  });

  it('3. Rejects proof if participant is not a student (ZK Constraint Violation)', async () => {
    const invalidContract = new HackathonEligibilityContract({
      getStudentWitness: () => createMockWitness({ isStudent: false })
    });
    await invalidContract.initializeHackathon(mockHackathonId, mockOrganizerKey);

    await expect(
      invalidContract.verifyAndRegisterParticipant(mockPrerequisiteHash)
    ).rejects.toThrow('Participant must be an active student');
  });

  it('4. Rejects proof if participant has not completed prerequisite', async () => {
    const invalidContract = new HackathonEligibilityContract({
      getStudentWitness: () => createMockWitness({ hasCompletedPrerequisite: false })
    });
    await invalidContract.initializeHackathon(mockHackathonId, mockOrganizerKey);

    await expect(
      invalidContract.verifyAndRegisterParticipant(mockPrerequisiteHash)
    ).rejects.toThrow('Participant must have completed required prerequisite');
  });

  it('5. Rejects proof if participant is a previous hackathon winner', async () => {
    const invalidContract = new HackathonEligibilityContract({
      getStudentWitness: () => createMockWitness({ hasNotWonPreviously: false })
    });
    await invalidContract.initializeHackathon(mockHackathonId, mockOrganizerKey);

    await expect(
      invalidContract.verifyAndRegisterParticipant(mockPrerequisiteHash)
    ).rejects.toThrow('Previous hackathon winners are ineligible');
  });
});
