## Integração com GITHUB

Criar um OAuth Apps em development settings na conta do github e configurar o endereço de callback apontando para o atena ex:

## <https://atena-mybot.serveo.net/integrations/github/callback>

Configurar as variáveis de ambiente no atena:

```sh
GITHUB_CLIENT_ID=123clientid
GITHUB_CLIENT_SECRET=12343clientsecret
GITHUB_REPOSITORIES=161529771
```

Ir em Configurações do repositório no github e adicionar um webook no projeto que quer integrar e apontar a url de Payload:

## <https://atena-mybot.serveo.net/integrations/github/events>

Content-Type: ***application/json***

Escolher os eventos:

*   Issues
*   Pull requests reviews
*   Pull requests
