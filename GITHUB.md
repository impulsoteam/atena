## Integração com GITHUB

Criar um OAuth Apps em development settings na conta do github e configurar o endereço de callback apontando para o atena ex:

***https://atena-mybot.serveo.net/integrations/github/callback***

Configurar as variáveis de ambiente no atena:

```
GITHUB_CLIENT_ID=a1e8e0d86d57411ef452
GITHUB_CLIENT_SECRET=f9aadb802a08a19938e9bd19398c09bbdc5d5edb
GITHUB_REPOSITORIES=161529771
```


Ir em Configurações do repositório no github e adicionar um webook no projeto que quer integrar e apontar a url de Payload:

***https://atena-mybot.serveo.net/integrations/github/events***

Content-Type: ***application/json***

Escolher os eventos:

* Issues
* Pull requests reviews
* Pull requests



