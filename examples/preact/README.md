## Setting up

### Fingerprint Public API key

In order to try out this example: 

1. Create a `.env` file in this directory.
2. Set the `PREACT_APP_FPJS_PUBLIC_API_KEY` environment variable to the value of your Fingerprint Public API key. 

To get the API key:

- Go to Fingerprint Dashboard > [API Keys](https://dashboard.fingerprint.com/api-keys) and find it there.
- If you don't have a Fingerprint Pro account, [sign up for free](https://dashboard.fingerprint.com/signup/).

### Installing dependencies

1. Go to the root of the project, install dependencies and build it (`cd ../../ && pnpm install && pnpm build`)
2. Come back to the example folder (`cd examples/preact`) and run `pnpm install`.

After you've completed all the steps and inserted the API key, you can run:

### `pnpm start`

Runs the app in the development mode.\
Open [http://localhost:8080](http://localhost:8080) to view it in the browser.

## Learn More

To learn more about Preact, take a look at the following resources:

- [Preact Documentation](https://preactjs.com/) - learn about Preact features and API.
- [Preact CLI Readme](https://github.com/developit/preact-cli/blob/master/README.md) - detailed explanation on how things work.
