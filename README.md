# js-webauthn

A TypeScript / JavaScript library for registering and authenticating with WebAuthn.

This library is intended to integrate with the Go backend library [spiretechnology/go-webauthn](https://github.com/spiretechnology/go-webauthn). Together, these two libraries will abstract away the complexities of WebAuthn encoding, decoding, verification, etc.

## Installation

```sh
npm install --save @spiretechnology/js-webauthn
```

## Example usage

```ts
import { WebAuthnClient } from '@spiretechnology/js-webauthn';

const client = new WebAuthnClient();

async function register() {
    // Request a challenge from the server
    const challenge = //...

    // Register a device with the WebAuthn client
    const response = await client.register(challenge);

    // Send the response to the server
    // ...
}

async function authenticate() {
    // Request a challenge from the server
    const challenge = //...

    // Authenticate with the WebAuthn client
    const response = await client.authenticate(challenge);

    // Send the response to the server
    // ...
}
```

## Other resources

-   [spiretechnology/go-webauthn](https://github.com/spiretechnology/go-webauthn) - WebAuthn backend library for Go.
