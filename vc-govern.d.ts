/*!
 * vcGovern
 * Copyright(c) 2024 Tobi Ajibade
 * MIT Licensed
 */
import { PresentationDefinitionV2 } from '@web5/credentials';
import { PortableDid } from '@web5/dids';
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
    issueVerifiableCredential(issueVerifiableCredentialParams: IssueVerifiableCredentialParams): Promise<string | undefined>;
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
    verifyCredentialFromPresentation(presentation: any, includeParsedData: boolean): Promise<CredentialVerificationResult[]>;
}
/**
 * Issue and verify verifiable credentials
 */
export declare const vcGovern: IVcGovern;
export {};
