export const siloPresentationDefinition = {
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
