## Configurando Rocket.Chat
Temos um servidor de staging do Rocket.Chat para testes e para a integração com este ambiente, você precisará de dois usuários:
1. Um usuário para logar na aplicação com perfil `bot` e ficar escutando as interações que ocorrem no chat.
2. Outro usuário com perfil `user` para logar na API do Rocket.Chat pela Atena e, assim, obter dados de outros usuários e disparar mensagens privadas e em chats.

### Criando os usuários
Para solicitar a criação de seus usuários em nosso ambiente staging, basta acessar o seguinte [formulário](https://impulsowork.typeform.com/to/nnIHqr) e se cadastrar.

Após o cadastro você deverá receber um email com dados das contas.

### Alteração de variáveis de ambiente
De posse dos novos dados (usuário, senha, token e id), você deve alterar o arquivo `.env` na raiz do projeto:

```sh
ROCKET_BOT_USER={usuario}
ROCKET_BOT_PASS={senha}
ROCKET_USER_TOKEN={bot-token}
ROCKET_USER_ID={bot-id}
```

- Apontar sua aplicação para o ambiente de staging, substituindo os valores abaixo:

```sh
ROCKET_HOST=staging.chat.impulso.network
ROCKETCHAT_URL=staging.chat.impulso.network
```
