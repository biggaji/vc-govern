# vc-govern

Web5 verifiable credentials manager.

vc-govern facilitates the issuance and verification of verifiable credentials (VCs) and the generation of
presentations. It leverages the capabilities of the @web5/credentials and @web5/dids libraries for creating
and handling decentralized identifiers (DIDs) and verifiable credentials.

## Installation

Using npm?

```bash
  npm install --save vc-govern
```

Using yarn?

```bash
  yarn add vc-govern
```

## Usage

```js
  // commonjs
  const { vcGovern } = require('vc-govern');

  // esm
  import { vcGovern } from 'vc-govern';

  const issuer = /* ... */; // Portable DID of the issuer
  const subject = /* ... */; // Portable DID of the subject
  const data = /* ... */; // Data to be included in the verifiable credential

  // Issue Verifiable Credential
  const vcJwt = await vcGovern.issueVerifiableCredential({
    issuer,
    subject,
    data,
    type: 'TestVerifiableCredential', // Optional, it is used to describe the type of credential being created.
  });

  // You should store the issued verifiable credential somewhere save

  // Presentation Definition
  const presentationDefinition: PresentationDefinitionV2 = /* ... */;

  // Verifiable Credential JWTs
  const vcJwts: string[] = /* ... */;

  // Generate Presentation
  const presentation = vcGovern.generatePresentation(presentationDefinition, vcJwts);

  // Verify Verifiable Credential
  const verificationResult = await vcGovern.verifyCredential(vcJwt, true);

  // Verify Verifiable Credentials within Presentation
  const verificationResults = await vcGovern.verifyCredentialFromPresentation(presentation, true);

```

# API

## `issueVerifiableCredential(issueVerifiableCredentialParams: IssueVerifiableCredentialParams): Promise<string | undefined>`

Issues a verifiable credential (VC) to a subject.

- `issuer`: Portable DID of the issuer.
- `subject`: Portable DID of the subject.
- `data`: Data to be included in the verifiable credential.
- `type`: Optional string or string array specifying the type of the credential.

Returns a signed JWT token representing the created verifiable credential.

## `generatePresentation(presentationDefinition: PresentationDefinitionV2, vcJwts: string[]): any`

Generates a presentation from a presentation definition by performing a presentation exchange (PEX).

- `presentationDefinition`: The presentation definition provided by the verifier.
- `vcJwts`: Verifiable Credential JWTs.

Returns a presentation.

## `verifyCredential(vcJwt: string, includeParsedData: boolean): Promise<CredentialVerificationResult>`

Verifies a signed verifiable credential JWT.

- `vcJwt`: The verifiable credential JWT to be verified.
- `includeParsedData`: A boolean indicating whether to include parsed credential data in the result.

Returns an object representing the evaluation of the result and the credential data if requested.

## `verifyCredentialFromPresentation(presentation: any, includeParsedData: boolean): Promise<CredentialVerificationResult[]>`

Verifies signed verifiable credentials within a presentation.

- `presentation`: The submitted presentation.
- `includeParsedData`: A boolean indicating whether to include parsed credential data in the result.

Returns an array of objects representing the evaluation of the result and the credential data if requested.

# Notes

- The `expirationDate` property is skipped due to a bug preventing the creation of VCs with the expiration
  date property set.

# License

vcGovern is licensed under the MIT License. See [LICENSE](LICENSE) for more information.
