# Atena v.0.2

<img src="https://s3-sa-east-1.amazonaws.com/assets.impulso.network/images/impulsonetwork-logo.svg" style="width: 100%">

[![Codacy Badge](https://api.codacy.com/project/badge/Grade/6b19092045904984b19c4775927d10b1)](https://app.codacy.com/app/impulsonetwork/atena?utm_source=github.com&utm_medium=referral&utm_content=impulsonetwork/atena&utm_campaign=Badge_Grade_Settings)
[![Build Status](https://dev.azure.com/universoimpulso/Atena/_apis/build/status/universoimpulso.atena)](https://dev.azure.com/universoimpulso/Atena/_build/latest?definitionId=4)
[![Website](https://img.shields.io/website-up-down-green-red/http/shields.io.svg?label=about)](http://impulso.network)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Twitter Follow](https://img.shields.io/twitter/follow/universoimpulso.svg?style=social&label=Follow)](https://twitter.com/UniversoImpulso)

[English Documentation](README_EN.md)

A Atena é uma iniciativa da Impulso Network em colaboração com vários Impulsers, com o objetivo de promover o engajamento e recompensar as atividades e esforços de cada pessoa na Impulso. Nele você poderá adquirir Pontos de Experiência (XP) através da execução de diversas atividades e com base nesses dois fatores os Impulsers receberão níveis e conquistas, reconhecendo o esforço despendido nas atividades.

## Integrações

A Atena hoje possui integrações com:

- [Rocket.Chat](https://rocket.chat/)
- [Github](https://github.com)
- [Worpress](https://br.wordpress.org/)

## Configuração

Segue um passo-a-passo da configuração mínima que você precisa para obter o Atena em execução:

### Configuração inicial

- Ter instalado o [Mongodb](https://docs.mongodb.com/manual/installation/)
- Ter instalado o [Yarn](https://yarnpkg.com/lang/pt-br/)

### Desenvolvimento

- Faça um [`fork`](FORK_PT_BR.md) do projeto para a tua conta
- Então, faça o `clone`:

```sh
> git clone https://github.com/{sua-conta}/atena
```

- Navegue até a pasta de destino onde fez o clone do projeto:

```sh
> cd atena/
```

- Instale as dependências utilizando o `yarn`:

```sh
> yarn -i
```

- Adicionar referências remotas da Atena:

```sh
> git remote add upstream https://github.com/universoimpulso/atena
```

- Criar o arquivo `.env` na raiz do projeto com as suas configurações copiando e renomeando o arquivo `.env.example` e, posteriormente, alterando alguns valores citados abaixo.

### Configurando a integração com Rocket.Chat

Para utilizar a integração do Rocket.Chat, siga os passos da documentação, clicando [aqui](ROCKET.CHAT_PT_BR.md).

### Configurando a integração com Github

Para utilizar a integração do Github, siga os passos da documentação, clicando [aqui](GITHUB_PT_BR.md).

### Configurando a integração com Wordpress

Para utilizar a integração do Github, siga os passos da documentação, clicando [aqui](WORDPRESS_PT_BR.md).

### Executando em ambiente de desenvolvimento

- Inicie o servidor utilizando o seguinte comando:

```sh
> yarn start:dev
```

### Debug

Caso deseje usar um debug, em um terminal inicie o servidor com o seguinte comando:

```sh
> yarn start:dev:debug
```

Rode o node inspect em outra janela de terminal:

```sh
> node-inspect localhost:9229
```

## Contribuindo

O principal objetivo deste repositório é continuar a evoluir o Atena, tornando-o mais rápido e fácil de usar.

O desenvolvimento da Atena acontece a céu aberto no GitHub, e somos gratos à comunidade por contribuir com correções de bugs e melhorias. Leia abaixo para saber como você pode participar da melhoria da Atena e da Impulso network.

[![user](https://sourcerer.io/fame/goldblade/impulsonetwork/atena/images/0)](https://sourcerer.io/fame/goldblade/impulsonetwork/atena/links/0) [![user](https://sourcerer.io/fame/goldblade/impulsonetwork/atena/images/1)](https://sourcerer.io/fame/goldblade/impulsonetwork/atena/links/1)[![user](https://sourcerer.io/fame/goldblade/impulsonetwork/atena/images/2)](https://sourcerer.io/fame/goldblade/impulsonetwork/atena/links/2)[![user](https://sourcerer.io/fame/goldblade/impulsonetwork/atena/images/3)](https://sourcerer.io/fame/goldblade/impulsonetwork/atena/links/3)[![user](https://sourcerer.io/fame/goldblade/impulsonetwork/atena/images/4)](https://sourcerer.io/fame/goldblade/impulsonetwork/atena/links/4)[![user](https://sourcerer.io/fame/goldblade/impulsonetwork/atena/images/5)](https://sourcerer.io/fame/goldblade/impulsonetwork/atena/links/5)[![user](https://sourcerer.io/fame/goldblade/impulsonetwork/atena/images/6)](https://sourcerer.io/fame/goldblade/impulsonetwork/atena/links/6)[![user](https://sourcerer.io/fame/goldblade/impulsonetwork/atena/images/7)](https://sourcerer.io/fame/goldblade/impulsonetwork/atena/links/7)

### [Código de Conduta](CODE_OF_CONDUCT.md)

A Impulso Network adotou um Código de Conduta que esperamos que os participantes do projeto sigam. Por favor, leia [Código de Conduta](CODE_OF_CONDUCT.md) para que você possa entender quais ações serão e não serão toleradas.

### [Guia de Contribuição](CONTRIBUTING_PT_BR.md)

Leia nosso [guia de contribuição](CONTRIBUTING_PT_BR.md) para conhecer nosso processo de desenvolvimento, como propor correções de erros e melhorias, e como construir e testar suas alterações no Atena.

## Comunidade

Todos os comentários e sugestões são bem-vindas e podem ser feitas via Issues no Github ou lá no [RocketChat](https://chat.impulso.network/)!

💬 Junte-se a comunidade em [Impulso Network](https://impulso.network)

## License

Este projeto está licenciado sob a licença MIT - consulte o arquivo [LICENSE](LICENSE.md) para obter detalhes.
