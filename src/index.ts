import { VerifiableCredential } from '@web5/credentials';
import { Web5 } from '@web5/api';
import { handleError } from './@utils/handleError.js';

/**
 * TODO:
 * Issue, manage and verify VCs
 * VC has an issuer, subject and a claim.
 */

type IssueVerifiableCredentialParams = {
  type?: IssuingCredentialType;
  issuer: string;
  subject: string;
  data: object;
  expirationDate?: Date;
};

enum IssuingCredentialType {
  EmploymentCredential = 'EmploymentCredential',
  EducationCredential = 'EducationCredential',
  GovermentIdentityCredential = 'GovermentIdentityCredential',
}

const ISSUING_CREDENTIAL_LIST = Array.from(Object.values(IssuingCredentialType));

/**
 * Issues a verifiable credential (VC) to a subject or entity
 * @param params
 * @returns {string} A VC JWT token
 */
async function issueVerifiableCredential(params: IssueVerifiableCredentialParams) {
  const { data, issuer, subject, type, expirationDate } = params;

  try {
    // Validate params
    if (!type) {
      throw new Error("The 'type' of the issuing credential is required");
    }

    if (!issuer) {
      throw new Error("The 'issuer DID' is required");
    }

    if (!subject) {
      throw new Error("The 'subject or holder DID' is required");
    }

    if (!data) {
      throw new Error("The 'data' is required");
    }

    // Check if type matches issuing cred type enum

    if (!ISSUING_CREDENTIAL_LIST.includes(type)) {
      throw new Error('Choose one of the pre-defined issuing type');
    }

    // Issue cred

    const credential = await VerifiableCredential.create({
      data,
      issuer,
      subject,
      type,
      issuanceDate: new Date().toISOString(),
      expirationDate: expirationDate!.toISOString() ?? undefined,
    });

    console.log(credential);

    // Sign cred
    // @ts-ignore
    const vc_agent_jwt = await credential.sign({ did: { did: issuer, document: {}, keySet: {} } });

    return vc_agent_jwt;
  } catch (error: any) {
    handleError(error);
  }
}

const vcred = issueVerifiableCredential({
  data: {
    gender: 'Male',
    nationality: 'Nigerian',
    state: 'Oyo',
    country: 'Nigeria',
  },
  issuer: 'Homesilo',
  subject: 'Agent',
  type: IssuingCredentialType.GovermentIdentityCredential,
});

console.log(vcred);
