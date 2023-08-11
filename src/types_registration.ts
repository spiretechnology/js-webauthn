import { Codec } from './codec';

export interface RegistrationChallenge {
	challenge: string;
	rp: {
		id: string;
		name: string;
	};
	user: {
		id: string;
		name: string;
		displayName: string;
	};
	pubKeyCredParams: { type: 'public-key'; alg: number }[];
}

export interface RegistrationResponse {
	challenge: string;
	credentialId: string;
	response: {
		clientDataJSON: string;
		attestationObject: string;
	};
	publicKey: string;
	publicKeyAlg: number;
}

export function convertRegistrationChallenge(
	input: RegistrationChallenge,
	codec: Codec
): PublicKeyCredentialCreationOptions {
	return {
		rp: input.rp,
		user: {
			id: new Uint8Array(
				input.user.id.split('').map((c) => c.charCodeAt(0))
			),
			name: input.user.name,
			displayName: input.user.displayName,
		},
		// excludeCredentials: [],
		pubKeyCredParams: input.pubKeyCredParams,
		// authenticatorSelection: {
		// 	authenticatorAttachment: 'cross-platform',
		// 	userVerification: 'preferred',
		// 	requireResidentKey: false,
		// },
		challenge: codec.decode(input.challenge),
	};
}

export function convertRegistrationResponse(
	cred: PublicKeyCredential,
	challenge: string,
	codec: Codec
): RegistrationResponse {
	const response = cred.response as AuthenticatorAttestationResponse;
	const publicKey = response.getPublicKey();
	if (!publicKey) throw new Error('no public key found');
	return {
		challenge,
		credentialId: codec.encode(cred.rawId),
		response: {
			clientDataJSON: codec.encode(response.clientDataJSON),
			attestationObject: codec.encode(response.attestationObject),
		},
		publicKey: codec.encode(publicKey),
		publicKeyAlg: response.getPublicKeyAlgorithm(),
	};
}
