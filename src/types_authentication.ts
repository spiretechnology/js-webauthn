import { Codec } from './codec';

export interface AuthenticationChallenge {
	challenge: string;
	rpId: string;
	allowCredentials: { type: 'public-key'; id: string }[];
}

export interface AuthenticationResponse {
	challenge: string;
	credentialId: string;
	response: {
		authenticatorData: string;
		clientDataJSON: string;
		signature: string;
		userHandle: string | null;
	};
}

export function convertAuthenticationChallenge(
	input: AuthenticationChallenge,
	codec: Codec
): PublicKeyCredentialRequestOptions {
	return {
		rpId: input.rpId,
		// userVerification: 'preferred',
		challenge: codec.decode(input.challenge),
		allowCredentials:
			input.allowCredentials.map<PublicKeyCredentialDescriptor>(
				(cred) => ({
					id: codec.decode(cred.id),
					type: cred.type,
					// transports: ['usb', 'ble', 'nfc'],
				})
			),
	};
}

export function convertAuthenticationResponse(
	cred: PublicKeyCredential,
	challenge: string,
	codec: Codec
): AuthenticationResponse {
	const response = cred.response as AuthenticatorAssertionResponse;
	return {
		challenge,
		credentialId: codec.encode(cred.rawId),
		response: {
			authenticatorData: codec.encode(response.authenticatorData),
			clientDataJSON: codec.encode(response.clientDataJSON),
			signature: codec.encode(response.signature),
			userHandle: response.userHandle
				? codec.encode(response.userHandle)
				: null,
		},
	};
}
