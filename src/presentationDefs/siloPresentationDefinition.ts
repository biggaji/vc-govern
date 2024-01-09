import { PresentationDefinitionV2 } from '@web5/credentials';

export const siloPresentationDefinition: PresentationDefinitionV2 = {
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
            path: ['$.type[*]'],
            filter: {
              type: 'string',
              pattern: 'SiloVerification',
            },
          },
          {
            path: ['$.credentialSubject.siloNum'],
            filter: {
              type: 'string',
              pattern: 'silo0_UR',
            },
          },
          {
            path: ['$.credentialSubject.fullName'],
            filter: {
              type: 'string',
            },
          },
          {
            path: ['$.credentialSubject.state'],
            filter: {
              type: 'string',
            },
          },
          {
            path: ['$.credentialSubject.city'],
            filter: {
              type: 'string',
            },
          },
          {
            path: ['$.credentialSubject.country'],
            filter: {
              type: 'string',
            },
          },
          {
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
