import { VerifiableCredential, PresentationExchange, PresentationDefinitionV2 } from '@web5/credentials';
import { Web5 } from '@web5/api';
import { DidIonMethod, PortableDid } from '@web5/dids';
import { config } from 'dotenv';
import { handleError } from './@utils/handleError.js';
import { siloPresentationDefinition } from './presentationDefs/siloPresentationDefinition.js';

// Load env(s)
config();

/**
 * TODO:
 * Issue, manage and verify VCs
 * Each verifiable credential has an issuer, subject and a claim.
 */

// NOTE: Property 'expirationDate' is skipped for now, there is a bug preventing the creation of VC's with expiration date.
type IssueVerifiableCredentialParams = {
  type?: IssuingCredentialType;
  issuer: PortableDid;
  subject: PortableDid;
  data: object;
};

enum IssuingCredentialType {
  EmploymentCredential = 'EmploymentCredential',
  EducationCredential = 'EducationCredential',
  GovermentIdentityCredential = 'GovermentIdentityCredential',
  SiloVerificationCredential = 'SiloVerificationCredential',
}

const ISSUING_CREDENTIAL_TYPE_LIST = Array.from(Object.values(IssuingCredentialType));

// __FOR_TESTING_ONLY__
const issuerPortableDID = await DidIonMethod.create();
const subjectPortableDID = await DidIonMethod.create();

/**
 * Issues a verifiable credential (VC) to a subject or entity
 * @param issueVerifiableCredentialParams
 * @returns {string} A JsonWebToken representing the created verifiable credential
 */
async function issueVerifiableCredential(issueVerifiableCredentialParams: IssueVerifiableCredentialParams) {
  const { data, issuer, subject, type } = issueVerifiableCredentialParams;

  try {
    // Validate params
    if (!type) {
      throw new Error("The 'type' of the issuing credential is required");
    }

    if (!issuer) {
      throw new Error("The 'issuer portable DID' is required");
    }

    if (!subject) {
      throw new Error("The 'subject or holder portable DID' is required");
    }

    if (!data) {
      throw new Error("The 'data' to be on the issued verificable credential is required");
    }

    // Check if provided 'type' matches issuing credentials 'type' enum
    if (!ISSUING_CREDENTIAL_TYPE_LIST.includes(type)) {
      throw new Error('Choose one of the pre-defined issuing type');
    }

    // Create credential
    const credential = await VerifiableCredential.create({
      data,
      type,
      issuer: issuer.did,
      subject: subject.did,
    });

    // Sign credential using the issuer portable DID
    const signedVerifiedCredentialJwt = await credential.sign({ did: issuer });

    return signedVerifiedCredentialJwt;
  } catch (error: any) {
    console.error(`Error issuing verifiable credential: ${error.message}`);
    handleError(error);
  }
}

// Issue a VC test
const verifiableCred = await issueVerifiableCredential({
  issuer: issuerPortableDID,
  subject: subjectPortableDID,
  type: IssuingCredentialType.EmploymentCredential,
  data: {
    gender: 'Male',
    nationality: 'Nigerian',
    state: 'Oyo',
    city: 'Ibadan',
    country: 'Nigeria',
    worksAt: 'Homesilo',
    role: 'Co-founder & CTO',
    department: 'Engineering',
  },
});

// console.log(verifiableCred);

// Parse VC JWT
const { vcDataModel } = await VerifiableCredential.parseJwt({ vcJwt: process.env.VC_JWT! });
const dataSubject: any = vcDataModel.credentialSubject;

// console.log(dataSubject);

// Verify VC_JWT
async function verifyVcJWT(vcJwt: string) {
  try {
    const verificationResult = await VerifiableCredential.verify({ vcJwt: process.env.VC_JWT! });
    return verificationResult;
  } catch (error: any) {
    handleError(error);
  }
}

// console.log((await verifyVcJWT(process.env.VC_JWT!)) ? 'valid' : 'invalid');

// Validate presentation definition
const validPresentationDef = PresentationExchange.validateDefinition({
  presentationDefinition: siloPresentationDefinition,
});

// console.log(validPresentationDef);

// Silo Credential Issurance
const siloResidentVerifiableCred = await issueVerifiableCredential({
  issuer: issuerPortableDID,
  subject: subjectPortableDID,
  type: IssuingCredentialType.SiloVerificationCredential,
  data: {
    siloNum: 'silo0_UR001',
    fullName: 'Tobiloba Ajibade',
    city: 'Ibadan',
    state: 'Oyo',
    country: 'Nigeria',
    joinedAt: new Date().toISOString(),
  },
});

// console.log(siloResidentVerifiableCred);

// Presentation EX

// Select only matching creds
const selecteCreds = PresentationExchange.selectCredentials({
  presentationDefinition: siloPresentationDefinition,
  vcJwts: [process.env.VC_JWT!, process.env.VC_JWT_SILO!],
});

// check if cred satisfies the PD
try {
  PresentationExchange.satisfiesPresentationDefinition({
    presentationDefinition: siloPresentationDefinition,
    vcJwts: selecteCreds,
  });
} catch (err: any) {
  console.error('Error checking if VC satisfies PD', err.message);
}

// Create presentation
const createPresentationResult = PresentationExchange.createPresentationFromCredentials({
  presentationDefinition: siloPresentationDefinition,
  vcJwts: selecteCreds,
});

// console.log(createPresentationResult);

// Validate presentation submission
const submissionCheck = PresentationExchange.validateSubmission({
  presentationSubmission: createPresentationResult.presentationSubmission,
});

// console.log(submissionCheck);

// Verify VC from presentation
