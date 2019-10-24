# Integração com Github

O Atena possui integração com o Github, onde o usuário ganha pontos ao criar pull requests, efetuar review e ter seu pull request aprovado.

## Criando um ambiente para testes

Para rodar um ambiente de testes do github será necessário:

- [Criar um repositório para testes](#criacao-de-repositorio)
- [Configurar um webhook para escutar eventos](#configuracao-de-webhook)
- [Criar um OAuth App para autenticação na aplicação](#criacao-de-oauth-app)
- [Adicionar permissão para o app acessar sua conta](#adicionar-permissao-para-o-app)

### Criação de repositório

Basta criar um repositório em sua conta para testes com qualquer conteúdo.

> Esse repositório servirá apenas para testar a criação de Pull Requests, merge de Pull Requests e criação de Issues, por isso seu conteúdo não terá relevância.

### Configuração de Webook

Acesse seu repositório de testes e vá em `Settings` > `Webhooks`, clique em `Add webhook` no canto superior direito e adicione os seguintes dados:

- **Payload URL**: `http://{sua-url-da-atena}/github/events`
- **Content type**: *application/json*
- **Which events would you like to trigger this webhook?**: *Send me everything.*
- Habilite a opção **Active**

### Criação de OAuth App

Para criar um app para efetuar seus testes:

- Clique [aqui](https://github.com/settings/applications/new) ou acesse sua conta no github, vá em `Settings` > `Developer settings` > `OAuth Apps` e clique em `New OAuth application` no canto superior direito.

- Ao criar o app, configure o endereço de `Authorization callback URL` apontando para a Atena: `http://{sua-url-da-atena}/github/callback`

## Configuração de variáveis de ambiente

Após criar seu app de teste, você de configurar as variáveis de ambiente no arquivo `.env` na raiz do projeto com os dados gerados:

```sh
GITHUB_CLIENT_ID={oauthapp-client-id}
GITHUB_CLIENT_SECRET={oauthapp-client-secret}
GITHUB_REPOSITORIES={repositorio-id}
```

## Adicionar permissão para o app

Para participar e receber pontuação, envie uma mensagem em qualquer canal no [Rocket.Chat](staging.chat.impulso.network) da Impulso com o comando *`!opensource`* e siga as instruções.
