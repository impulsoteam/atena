## INSTRUÇÕES

### Sandbox

-   Join sandbox [Slack](https://join.slack.com/t/impulso-sandbox/shared_invite/enQtNDQwODY3MzcxNDEzLTc1NTlkODA4NmY0YjJkZWYyMWRiOTE2MTA5YzczMzVhNzQzZDY0ZDVkYjI3ZDFlMTQ2ZmFmOTRmODNmMWRhOGY)


### Criando um Slack App

-   [Building Slack app](https://api.slack.com/slack-apps)
-   Criar um Slack app

  -   Nome do App: `atena-sandbox-{yourname}`
  -   Selecione o Workspace: `Impulso - Sandbox`

-   Configuração:
  -   Menu > Features > Event Subscriptions: activate
    -   Request URL: `https://atena-staging-{username}.localtunnel.me/slack/events`
    -   Adicione quais eventos do workspace:
      -   `message.channels`, `reaction_added` and `reaction_removed`
    -   Salvando as alterações
  -   Menu > Features > OAuth & Permissions
    -   Scopes > Select Permission Scopes:
      -   Adicione `users.profile:read` e `channels:read`
      -   Salve as mudanças
    -   Instale o app em seu workspace
    -   Copie OAuth Access Token e adicione no SLACK_TOKEN no teu arquivo `.env`
  -   Menu > Settings > Basic Information
    -   Copie o Signing Secret e adicione no SLACK_SIGNIN_EVENTS no teu arquivo `.env`

### Conta Google Analytcs (opcional)

-   Crie uma conta
-   Adicione o código de rastreio `UA-{number}` no arquivo `.env`
