<img src="https://impulso.network/assets/images/impulsonetwork-logo.svg" style="width: 350px">

[![Codacy Badge](https://api.codacy.com/project/badge/Grade/6b19092045904984b19c4775927d10b1)](https://app.codacy.com/app/impulsonetwork/atena?utm_source=github.com&utm_medium=referral&utm_content=impulsonetwork/atena&utm_campaign=Badge_Grade_Settings)
[![Build Status](https://dev.azure.com/impulsonetwork/Atena/_apis/build/status/impulsonetwork.atena)](https://dev.azure.com/impulsonetwork/Atena/_build/latest?definitionId=3)
[![Website](https://img.shields.io/website-up-down-green-red/http/shields.io.svg?label=about)](http://impulso.network)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Twitter Follow](https://img.shields.io/twitter/follow/impulsonetwork.svg?style=social&label=Follow)](https://twitter.com/impulsonetwork)


## Atena v.0.2

### [en](https://github.com/impulsonetwork/atena/blob/master/README_EN.md)

A Atena é uma iniciativa da Impulso Network em colaboração com vários Impulsers, com o objetivo de promover o engajamento e recompensar as atividades e esforços de cada pessoa na Impulso. Nele você poderá adquirir Pontos de Experiência (XP) através da execução de diversas atividades e com base nesses dois fatores os Impulsers receberão níveis e conquistas, reconhecendo o esforço despendido nas atividades.

## Configuração

Um passo-a-passo da configuração mínima que você precisa para obter o Atena em execução.

### Configuração inicial

- Instalar o mongodb [Mongodb](https://docs.mongodb.com/manual/installation/)
- Criar um aplicativo Slack utilizando ngrok - [Using ngrok to develop locally for Slack](https://api.slack.com/tutorials/tunneling-with-ngrok)

### Desenvolvimento

- Faça um  `fork` do projeto para a tua conta, e então faça o `clone`
```sh
> git clone https://github.com/[your account]/atena
```

- Navegue até a pasta de destino onde fez o clone do projeto
```sh
> cd atena/
```

- Instale o `yarn` a partir do `npm` (ser global é opcional)
```sh
> npm i yarn -g
```

- instalar os repositorios utilizando o `yarn`
```sh
> yarn -i
```

- Adicionar referências remotas
```sh
> git remote add upstream https://github.com/impulsonetwork/atena
```
- Criar o arquivo `.env` com as suas configurações utilizando o `.env.example` presente no projeto
```
PORT=4390
SLACK_SIGNIN_EVENTS=
SLACK_TOKEN=
GA=
MONGODB_URI=mongodb://localhost/atena
CHANNELS=CCWSMJZ6U CCXCXJWBW
```

### Executando

- Inicie o servidor utilizando o seguinte comando:
```sh
> yarn start:dev
```

### Debug

Em um terminal inicie o servidor com o seguinte comando:
```
> yarn start:dev:debug
```
Rode o node inspect em outra janela de terminal
```
> node-inspect localhost:9229
```
### Configurando o Bot do Rocket

É preciso gerar um token, para isso o bot precisa da role de usuário. Logar com
usuário e senha do bot no servidor e gerar o token de acesso.

## Contribuindo

O principal objetivo deste repositório é continuar a evoluir o Atena, tornando-o mais rápido e fácil de usar.

O desenvolvimento da Atena acontece a céu aberto no GitHub, e somos gratos à comunidade por contribuir com correções de bugs e melhorias. Leia abaixo para saber como você pode participar da melhoria da Atena e da Impulso network.

### [Código de Conduta](CONTRIBUTING.md)

A Impulso Network adotou um Código de Conduta que esperamos que os participantes do projeto sigam. Por favor, leia [Código de Conduta](CONTRIBUTING.md) para que você possa entender quais ações serão e não serão toleradas.

### [Guia de Contribuição](CONTRIBUTING.md)

Leia nosso [guia de contribuição](CONTRIBUTING.md) para conhecer nosso processo de desenvolvimento, como propor correções de erros e melhorias, e como construir e testar suas alterações no Atena.

## Comunidade

Todos os comentários e sugestões são bem-vindas e podem ser feitas via Issues no Github ou lá no Slack!

💬 Junte-se a comunidade em [Impulso Network](https://impulso.network)

## License

Este projeto está licenciado sob a licença MIT - consulte o arquivo [LICENSE.md](LICENSE.md) para obter detalhes.
