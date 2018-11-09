## INSTRUCTIONS

### Sandbox

- Join sandbox [Slack](https://join.slack.com/t/impulso-sandbox/shared_invite/enQtNDQwODY3MzcxNDEzLTc1NTlkODA4NmY0YjJkZWYyMWRiOTE2MTA5YzczMzVhNzQzZDY0ZDVkYjI3ZDFlMTQ2ZmFmOTRmODNmMWRhOGY)

### Create Slack app

-[Building Slack app](https://api.slack.com/slack-apps)
- Create a Slack app

  - App Name: `atena-sandbox-{yourname}`
  - Select Workspace: `Impulso - Sandbox`

- Setup:
  - Menu > Features > Event Subscriptions: activate
    - Request URL: Put ngrok address or localtunnel address
    - Request URL: Put localtunnel address - `https://atena-staging-{username}.localtunnel.me/slack/events`
    - Add Workspace Event:
      - `message.channels`, `reaction_added` and `reaction_removed`
    - Save Changes
  - Menu > Features > OAuth & Permissions
    - Scopes > Select Permission Scopes:
      - Add `users.profile:read` and `channels:read`
      - Save Changes
    - Install App to Workspace
    - Copy OAuth Access Token and add in SLACK_TOKEN on `.env`
  - Menu > Settings > Basic Information
    - Copy Signing Secret and add in SLACK_SIGNIN_EVENTS ON `.env`

### Google Analytcs account (optional)

- Create account
- Add Tracking code `UA-{number}` in GA on `.env`
