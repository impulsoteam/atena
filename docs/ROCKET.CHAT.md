# Setting up the Rocket.Chat

We have a Rocket.Chat staging server for testing. For integration with this environment, you will need two users:

1. A user to log into the application with profile `bot` and listen to the interactions that occur in chat.
2. Another user with profile `user` to log in to the Rocket.Chat API to get data from other users and trigger chat and private messages.

## Creating users

To request the creation of your users in our staging environment, access the following [form](https://impulsowork.typeform.com/to/nnIHqr).

After registration you should receive an email with account data.

## Changing environment variables

- With the new data (user and password), you must change the `.env` file in the project root:

```sh
ROCKET_BOT_USER={user}
ROCKET_BOT_PASS={password}
```

- Set your application to the staging environment by replacing the values below:

```sh
ROCKET_HOST=staging.chat.impulso.network
ROCKETCHAT_URL=staging.chat.impulso.network
```
