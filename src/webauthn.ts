import { Codec } from './codec';
import { Base64URL } from './codec_base64url';
import {
	AuthenticationChallenge,
	AuthenticationResponse,
	convertAuthenticationChallenge,
	convertAuthenticationResponse,
} from './types_authentication';
import {
	RegistrationChallenge,
	RegistrationResponse,
	convertRegistrationChallenge,
	convertRegistrationResponse,
} from './types_registration';

type CreateCredentialFunc = (
	options: CredentialCreationOptions
) => Promise<Credential | null>;
type GetCredentialFunc = (
	options: CredentialRequestOptions
) => Promise<Credential | null>;

export class WebAuthnClient {
	public constructor(
		private codec: Codec = Base64URL,
		private createCredential: CreateCredentialFunc = navigator.credentials
			.create,
		private getCredential: GetCredentialFunc = navigator.credentials.get
	) {}

	public async register(
		challenge: RegistrationChallenge,
		timeout?: number
	): Promise<RegistrationResponse> {
		// Convert the challenge to a PublicKeyCredentialCreationOptions
		const options = convertRegistrationChallenge(challenge, this.codec);
		options.timeout = timeout;

		// Create the credential
		const cred = await this.createCredential({ publicKey: options });
		if (!cred || !(cred instanceof PublicKeyCredential))
			throw new Error('invalid credential');

		// Convert the credential into a RegistrationResponse
		return convertRegistrationResponse(cred, this.codec);
	}

	public async authenticate(
		challenge: AuthenticationChallenge,
		timeout?: number
	): Promise<AuthenticationResponse> {
		// Convert the challenge to a PublicKeyCredentialRequestOptions
		const options = convertAuthenticationChallenge(challenge, this.codec);
		options.timeout = timeout;

		// Get a credential and a signed challenge
		const assertion = await this.getCredential({ publicKey: options });
		if (!assertion || !(assertion instanceof PublicKeyCredential))
			throw new Error('invalid credential assertion');

		// Convert the credential into an AuthenticationResponse
		return convertAuthenticationResponse(assertion, this.codec);
	}
}
