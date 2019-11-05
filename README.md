# Atena v.0.2

<img src="https://s3-sa-east-1.amazonaws.com/assets.impulso.network/images/impulsonetwork-logo.svg" style="width: 100%">

[![Codacy Badge](https://api.codacy.com/project/badge/Grade/6b19092045904984b19c4775927d10b1)](https://app.codacy.com/app/impulsonetwork/atena?utm_source=github.com&utm_medium=referral&utm_content=impulsonetwork/atena&utm_campaign=Badge_Grade_Settings)
[![Build Status](https://dev.azure.com/universoimpulso/Atena/_apis/build/status/universoimpulso.atena)](https://dev.azure.com/universoimpulso/Atena/_build/latest?definitionId=4)
[![Website](https://img.shields.io/website-up-down-green-red/http/shields.io.svg?label=about)](http://impulso.network)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Twitter Follow](https://img.shields.io/twitter/follow/universoimpulso.svg?style=social&label=Follow)](https://twitter.com/UniversoImpulso)

[Documentação em Português](docs/README_PT_BR.md)

Atena is an initiative of Impulso Network in collaboration with several Impulsers, in order to promote the engagement and reward the activities and efforts of each person on Impulso Network. Here you can gain Experience Points (XP) by performing various activities and based on these two factors Impulsers will receive levels and achievements, recognizing the effort expended on the activities.

## Integrations

Atena today has integrations with:

- [Rocket.Chat](https://rocket.chat/)
- [Github](https://github.com)
- [Worpress](https://br.wordpress.org/)

## Setup

Here is a step-by-step minimum configuration that you need to get the Atena running::

### Initial setup

- Have installed [Mongodb](https://docs.mongodb.com/manual/installation/)
- Have installed [Yarn](https://yarnpkg.com/lang/pt-br/)

### Development

- Make a project [`fork`](docs/FORK.md) to your account

- Then, make a `clone`:

```sh
> git clone https://github.com/{your account}/atena
```

- Navigate to the destination folder where you clone the project:

```sh
> cd atena/
```

- Install the dependencies using `yarn`:

```sh
> yarn -i
```

- Add remote references from Atena:

```sh
> git remote add upstream https://github.com/universoimpulso/atena
```

- Create a `.env` file at the root of the project by copying and renaming the `.env.example` file and later changing some values ​​cited below:

### Configuring Rocket.Chat Integration

To use Rocket.Chat integration, follow the documentation steps by clicking [here](docs/ROCKET.CHAT.md).

### Configuring Github Integration

To use Github integration, follow the documentation steps by clicking [here](docs/GITHUB.md).

### Configuring Wordpress Integration

To use Wordpress integration, follow the documentation steps by clicking [here](docs/WORDPRESS.md).

### Running in development environment

Start the server using the following command:

```sh
> yarn start:dev
```

### Debug

If you want to use a debug, start the server with the following command:

```sh
> yarn start:dev:debug
```

### Run node inspect in another terminal

```sh
> node-inspect localhost:9229
```

## Contributing

The main purpose of this repository is to continue to evolve Atena, making it faster and easier to use.

Atena is a open-source project, and we are grateful to the community for contributing with bug fixes and improvements. Read more to learn how you can participate in improving Atena and the Impulso network.

[![user](https://sourcerer.io/fame/goldblade/impulsonetwork/atena/images/0)](https://sourcerer.io/fame/goldblade/impulsonetwork/atena/links/0) [![user](https://sourcerer.io/fame/goldblade/impulsonetwork/atena/images/1)](https://sourcerer.io/fame/goldblade/impulsonetwork/atena/links/1)[![user](https://sourcerer.io/fame/goldblade/impulsonetwork/atena/images/2)](https://sourcerer.io/fame/goldblade/impulsonetwork/atena/links/2)[![user](https://sourcerer.io/fame/goldblade/impulsonetwork/atena/images/3)](https://sourcerer.io/fame/goldblade/impulsonetwork/atena/links/3)[![user](https://sourcerer.io/fame/goldblade/impulsonetwork/atena/images/4)](https://sourcerer.io/fame/goldblade/impulsonetwork/atena/links/4)[![user](https://sourcerer.io/fame/goldblade/impulsonetwork/atena/images/5)](https://sourcerer.io/fame/goldblade/impulsonetwork/atena/links/5)[![user](https://sourcerer.io/fame/goldblade/impulsonetwork/atena/images/6)](https://sourcerer.io/fame/goldblade/impulsonetwork/atena/links/6)[![user](https://sourcerer.io/fame/goldblade/impulsonetwork/atena/images/7)](https://sourcerer.io/fame/goldblade/impulsonetwork/atena/links/7)

### [Code of Conduct](docs/CODE_OF_CONDUCT.md)

Impulso Network has adopted a Code of Conduct to guide our participants. Please read [Code of Conduct](docs/CODE_OF_CONDUCT.md) for more infos.

### [Contribution Guide](docs/CONTRIBUTING.md)

Read our [contribution guide](docs/CONTRIBUTING.md) to learn about our development process, how to propose bug fixes and improvements, and how to build and test your changes in Atena.

## Community

All comments and suggestions are welcome and can be made via Issues on Github or on [RocketChat](https://chat.impulso.network/)!

💬 Join the community in [Impulso Network](https://impulso.network)

## License

This project is licensed under the MIT license - see the [LICENSE](LICENSE.md) file for details.
