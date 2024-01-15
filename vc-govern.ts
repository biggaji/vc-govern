import { PresentationDefinitionV2, PresentationExchange, VerifiableCredential } from '@web5/credentials';
import { PortableDid } from '@web5/dids';

// NOTE: Property 'expirationDate' is skipped for now, there is a bug preventing the creation of VCs with expiration date property set.
type IssueVerifiableCredentialParams = {
  issuer: PortableDid;
  subject: PortableDid;
  data: any;
  type?: string | string[];
};

type CredentialVerificationResult = {
  valid: boolean;
  data?: any;
};

interface IVcGovern {
  /**
   * Issues a verifiable credential (VC) to a subject
   * @method issueVerifiableCredential
   * @param issueVerifiableCredentialParams
   * @returns {string} A signed jwt token representing the created verifiable credential
   */
  issueVerifiableCredential(
    issueVerifiableCredentialParams: IssueVerifiableCredentialParams,
  ): Promise<string | undefined>;

  /**
   * Generates a presentation from a presentation definition by performing a presentation exchange (PEX)
   * @method generatePresentation
   * @param presentationDefinition
   * @param vcJwts
   * @returns A presentation
   */
  generatePresentation(presentationDefinition: PresentationDefinitionV2, vcJwts: string[]): any;

  /**
   * Verify a signed verifiable credential jwt
   * @method verifyCredential
   * @param vcJwt
   * @param includeParsedData
   * @returns {CredentialVerificationResult} An object representing the evaluation of the result and the credential data if requested
   */
  verifyCredential(vcJwt: string, includeParsedData: boolean): Promise<CredentialVerificationResult>;

  /**
   * Verifies signed verifiable credentials within a presentation
   * @method verifyCredentialFromPresentation
   * @param presentation
   * @param includeParsedData
   * @returns {CredentialVerificationResult} An object representing the evaluation of the result and the credential data if requested
   */
  verifyCredentialFromPresentation(
    presentation: any,
    includeParsedData: boolean,
  ): Promise<CredentialVerificationResult[]>;
}

/**
 * Issue and verify verifiable credentials
 */
export const vcGovern: IVcGovern = {
  async issueVerifiableCredential(issueVerifiableCredentialParams) {
    try {
      // Validate input params
      const { issuer, subject, data, type } = issueVerifiableCredentialParams;

      if (!issuer) {
        throw new Error("The 'issuer portable DID' is required");
      }

      if (!subject) {
        throw new Error("The 'subject or holder portable DID' is required");
      }

      if (!data) {
        throw new Error("The 'data' is required");
      }

      // Create credential
      const credential = await VerifiableCredential.create({
        data,
        issuer: issuer.did,
        subject: subject.did,
        type: type ?? undefined,
      });

      // Sign newly created verifiable credential with the issuer portableDID
      return await credential.sign({ did: issuer })!;
    } catch (error: any) {
      console.error('Error issuing a verifiable credential:', error.message);
      throw error;
    }
  },

  generatePresentation(presentationDefinition, vcJwts) {
    try {
      if (!presentationDefinition) {
        throw new Error("The 'presentation definition' provided by the verifier is required");
      }

      if (!vcJwts || vcJwts.length === 0) {
        throw new Error("Provide at least 1 'vcJwt'");
      }

      // To preserve user privacy, select credentials that matches the presentation definition requirements
      const selectedVcJwts = PresentationExchange.selectCredentials({ vcJwts, presentationDefinition });

      // Ensure that selected credentials collectively satisfies all the presentation definition requirements
      PresentationExchange.satisfiesPresentationDefinition({
        presentationDefinition,
        vcJwts: selectedVcJwts,
      });

      // Generate presentation from the selected verifiable credentials using the presentation definition
      const presentation = PresentationExchange.createPresentationFromCredentials({
        presentationDefinition,
        vcJwts: selectedVcJwts,
      });

      return presentation;
    } catch (error: any) {
      console.error('Error generating presentation from presentation definition:', error.message);
      throw error;
    }
  },

  async verifyCredential(vcJwt, includeParsedData) {
    try {
      const verificationResult = await VerifiableCredential.verify({ vcJwt });
      return {
        valid: verificationResult !== undefined,
        ...(includeParsedData && {
          data: VerifiableCredential.parseJwt({ vcJwt }).vcDataModel.credentialSubject,
        }),
      };
    } catch (error: any) {
      console.error('Error verifing a verifiable credential jwt:', error.message);
      throw error;
    }
  },

  async verifyCredentialFromPresentation(presentation, includeParsedData) {
    try {
      const verificationResultList: CredentialVerificationResult[] = [];

      // Validate submitted presentation before starting verification process
      const presentationSubmissionCheck: any = PresentationExchange.validateSubmission({
        presentationSubmission: presentation.presentationSubmission,
      });

      const presentationSubmissionAssertionCheckResult = presentationSubmissionCheck.filter(
        (presentation: any) => {
          return presentation.status !== 'info';
        },
      );

      if (presentationSubmissionAssertionCheckResult.length) {
        throw new Error('The submitted presentation is not valid');
      }

      const vcJwts = presentation.presentation.verifiableCredential!;

      if (!vcJwts.length) {
        throw new Error('No verifiable credential is found within the submitted presentation');
      }

      // Loop through vc jwts and verify them individually
      for (let vcJwt of vcJwts) {
        const verificationResult = await VerifiableCredential.verify({ vcJwt });
        verificationResultList.push({
          valid: verificationResult !== undefined,
          ...(includeParsedData && { data: verificationResult.vc.credentialSubject }),
        });
      }

      return verificationResultList;
    } catch (error: any) {
      console.error('Error verifing a verifiable credential jwt from presentation:', error.message);
      throw error;
    }
  },
};
