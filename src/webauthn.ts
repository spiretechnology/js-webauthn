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

export class WebAuthnClient {
	public constructor(private codec: Codec = Base64URL) {}

	public async register(
		challenge: RegistrationChallenge,
		timeout?: number
	): Promise<RegistrationResponse> {
		// Convert the challenge to a PublicKeyCredentialCreationOptions
		const options = convertRegistrationChallenge(challenge, this.codec);
		options.timeout = timeout;

		// Create the credential
		const cred = await navigator.credentials.create({ publicKey: options });
		if (!cred || !(cred instanceof PublicKeyCredential))
			throw new Error('invalid credential');

		// Convert the credential into a RegistrationResponse
		return convertRegistrationResponse(
			cred,
			challenge.token,
			challenge.challenge,
			this.codec
		);
	}

	public async authenticate(
		challenge: AuthenticationChallenge,
		timeout?: number
	): Promise<AuthenticationResponse> {
		// Convert the challenge to a PublicKeyCredentialRequestOptions
		const options = convertAuthenticationChallenge(challenge, this.codec);
		options.timeout = timeout;

		// Get a credential and a signed challenge
		const assertion = await navigator.credentials.get({
			publicKey: options,
		});
		if (!assertion || !(assertion instanceof PublicKeyCredential))
			throw new Error('invalid credential assertion');

		// Convert the credential into an AuthenticationResponse
		return convertAuthenticationResponse(
			assertion,
			challenge.token,
			challenge.challenge,
			this.codec
		);
	}
}
