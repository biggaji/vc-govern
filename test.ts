import { DidIonMethod } from '@web5/dids';
import { vcGovern } from './vc-govern.js';

// __FOR_TESTING_ONLY__
const issuerPortableDID = await DidIonMethod.create();
const subjectPortableDID = await DidIonMethod.create();

const payload = {
  issuer: issuerPortableDID,
  subject: subjectPortableDID,
  type: 'SiloVerificationCredential',
  data: {
    siloNum: 'silo0_UR001',
    fullName: 'Tobiloba Ajibade',
    city: 'Ibadan',
    state: 'Oyo',
    country: 'Nigeria',
    joinedAt: new Date().toISOString(),
  },
};

const PD = {
  id: 'siloPD001',
  name: 'Credential verification for silo estate residents',
  purpose: 'To identity legitness of silo estate resident',
  input_descriptors: [
    {
      id: 'siloResidenceVerification',
      name: 'Silo Residence Verification',
      purpose: 'Verify user residence permission',
      constraints: {
        fields: [
          {
            id: 'siloVerificationType',
            purpose: "Select only VC(s) with type 'siloVerification'",
            path: ['$.type[*]'],
            filter: {
              type: 'string',
              pattern: 'SiloVerification',
            },
          },
          {
            id: 'siloNum',
            purpose: 'Confirm silo resident number',
            path: ['$.credentialSubject.siloNum'],
            filter: {
              type: 'string',
              pattern: 'silo0_UR',
            },
          },
          {
            id: 'fullName',
            purpose: 'Confirm silo resident full name',
            path: ['$.credentialSubject.fullName'],
            filter: {
              type: 'string',
            },
          },
          {
            id: 'state',
            purpose: 'Confirm silo resident state',
            path: ['$.credentialSubject.state'],
            filter: {
              type: 'string',
            },
          },
          {
            id: 'city',
            purpose: 'Confirm silo resident city',
            path: ['$.credentialSubject.city'],
            filter: {
              type: 'string',
            },
          },
          {
            id: 'country',
            purpose: 'Confirm silo resident country',
            path: ['$.credentialSubject.country'],
            filter: {
              type: 'string',
            },
          },
          {
            id: 'joinedAt',
            purpose: 'Confirm date and time resident joined silo estate',
            path: ['$.credentialSubject.joinedAt'],
            filter: {
              type: 'string',
            },
          },
        ],
      },
    },
  ],
};

// Issue VC
const vcJwt = await vcGovern.issueVerifiableCredential(payload);

if (vcJwt) {
  // Generate a presentation
  const presentation = vcGovern.generatePresentation(PD, [vcJwt!]);

  // Verify single credential and return data content
  const verify = await vcGovern.verifyCredential(vcJwt, true);

  // Verify credential using the generated presentation instead
  const verifyFromPresentation = await vcGovern.verifyCredentialFromPresentation(presentation, true);
  console.log(verifyFromPresentation);
}
