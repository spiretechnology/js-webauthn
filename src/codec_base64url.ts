import { Codec } from './codec';

function encodeBase64URL(buffer: ArrayBuffer): string {
	let binary: string = '';
	const bytes: Uint8Array = new Uint8Array(buffer);
	for (let i = 0; i < bytes.byteLength; i++) {
		binary += String.fromCharCode(bytes[i]);
	}
	return btoa(binary)
		.replace(/\+/g, '-')
		.replace(/\//g, '_')
		.replace(/=/g, '');
}

function decodeBase64URL(str: string): ArrayBuffer {
	return Uint8Array.from(
		atob(str.replace(/-/g, '+').replace(/_/g, '/')),
		(c) => c.charCodeAt(0)
	).buffer;
}

export const Base64URL: Codec = {
	encode: encodeBase64URL,
	decode: decodeBase64URL,
};
