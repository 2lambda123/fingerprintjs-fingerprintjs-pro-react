This example demonstrates the usage of Fingerprint Pro inside Next 14's `app` directory approach.\
Note how you can use Fingerprint Pro inside a React Server Component without issues as it is correctly executed in the browser only.
See [../next](../next/README.md) for an example using the classic `pages` approach.

## Setting up

### Fingerprint Public API key

In order to try out these examples: 
1. Create a `.env` (or `.env.local`) file in this directory.
2. Set the `NEXT_PUBLIC_FPJS_PUBLIC_API_KEY` environment variable to the value of your Fingerprint Public API key. 

To get the API key:

- Go to Fingerprint Dashboard > [API Keys](https://dashboard.fingerprint.com/api-keys) and find it there.
- If you don't have a Fingerprint Pro account, [sign up for free](https://dashboard.fingerprint.com/signup/).

### Installing dependencies

1. Go to the root of the project, install dependencies and build it (`cd ../../ && pnpm install && pnpm build`)
2. Come back to the example folder (`cd examples/next-appDir`) and run `pnpm install`.

After you've completed all the steps and inserted the API key, you can run:

### `pnpm dev`

Runs the app in the development mode.\
Open [http://localhost:3002](http://localhost:3002) to view it in the browser.