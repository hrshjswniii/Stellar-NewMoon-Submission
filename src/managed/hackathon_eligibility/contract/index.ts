// Generated TypeScript contract bindings for HackathonEligibility Compact ZK contract
export enum VerificationStatus {
  NotVerified = 0,
  Eligible = 1,
  AlreadyRegistered = 2
}

export interface StudentWitness {
  studentIdHash: Uint8Array;
  prerequisiteCertificateHash: Uint8Array;
  secretSalt: Uint8Array;
  isStudent: boolean;
  hasCompletedPrerequisite: boolean;
  hasNotWonPreviously: boolean;
}

export interface HackathonEligibilityWitnesses {
  getStudentWitness: () => Promise<StudentWitness> | StudentWitness;
}

export class HackathonEligibilityContract {
  public hackathonId: Uint8Array = new Uint8Array(32);
  public organizerPubKey: Uint8Array = new Uint8Array(32);
  public verifiedNullifiers: Map<string, boolean> = new Map();
  public totalParticipants: number = 0;

  constructor(private witnesses: HackathonEligibilityWitnesses) {}

  public async initializeHackathon(id: Uint8Array, organizerKey: Uint8Array): Promise<void> {
    this.hackathonId = id;
    this.organizerPubKey = organizerKey;
  }

  public async verifyAndRegisterParticipant(prerequisiteRequiredHash: Uint8Array): Promise<VerificationStatus> {
    const witness = await this.witnesses.getStudentWitness();

    if (!witness.isStudent) {
      throw new Error("ZK Constraint Failure: Participant must be an active student");
    }
    if (!witness.hasCompletedPrerequisite) {
      throw new Error("ZK Constraint Failure: Participant must have completed required prerequisite");
    }
    if (!witness.hasNotWonPreviously) {
      throw new Error("ZK Constraint Failure: Previous hackathon winners are ineligible");
    }

    // Check prerequisite hash matching
    const hashMatch = witness.prerequisiteCertificateHash.every((val, idx) => val === prerequisiteRequiredHash[idx]);
    if (!hashMatch) {
      throw new Error("ZK Constraint Failure: Prerequisite certificate hash mismatch");
    }

    // Generate nullifier from student ID, hackathon ID, and secret salt
    const nullifierStr = Buffer.from(witness.studentIdHash).toString('hex') +
      "_" + Buffer.from(this.hackathonId).toString('hex');

    if (this.verifiedNullifiers.get(nullifierStr)) {
      return VerificationStatus.AlreadyRegistered;
    }

    this.verifiedNullifiers.set(nullifierStr, true);
    this.totalParticipants += 1;

    return VerificationStatus.Eligible;
  }
}
