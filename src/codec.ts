export interface Codec {
	encode(data: ArrayBuffer): string;
	decode(str: string): ArrayBuffer;
}
