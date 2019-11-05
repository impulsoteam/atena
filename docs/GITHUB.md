# Github Integration

Atena has integration with Github, where the user earns reputation by creating pull requests, reviewing and having their pull request approved.

## Creating a test environment

To run a github test environment you will need:

- [Create a test repository](###criacao-de-repositorio)
- [Set up a webhook to listen events](#configuracao-de-webhook)
- [Create an OAuth App for in-app authentication](#criacao-de-oauth-app)
- [Add permission to access your account](#adicionar-permissao-para-o-app)

### Repository creation

Just create a repository in your account for testing with any content.

> This repository will only serve for testing PR, PR merge, and Issues, so its content will have no relevance.

### Set up Webook

Go to your test repository and go to `Settings`>` Webhooks`,  click `Add webhook` in the upper right corner and add the following data:

- **Payload URL**: `http://{your atena url}/github/events`
- **Content type**: *application/json*
- **Which events would you like to trigger this webhook?**: *Send me everything.*
- Enable the option **Active**

### OAuth App Creation

To create an app to run your tests:

- Click [here](https://github.com/settings/applications/new) or sign in to your github account, go to `Settings` > `Developer settings` >`OAuth Apps` and click`New OAuth application` at the top right corner.

- When creating the app, set the `Authorization callback URL` address by pointing to Athena:`http://{atena url}/github/callback`

## Setting environment variables

After you create your test app, set the environment variables in the `.env` file in the project root with the generated data:

```sh
GITHUB_CLIENT_ID={oauthapp-client-id}
GITHUB_CLIENT_SECRET={oauthapp-client-secret}
GITHUB_REPOSITORIES={repo-id}
```

## Add app permission

To participate and receive reputarion, send a message on any channel on [Rocket.Chat](staging.chat.impulso.network) with the command `!opensource` and follow the instructions.
