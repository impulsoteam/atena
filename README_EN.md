<img src="https://impulso.network/assets/images/impulsonetwork-logo.svg" style="width: 350px">

[![Build Status](https://dev.azure.com/impulsonetwork/Atena/_apis/build/status/impulsonetwork.atena)](https://dev.azure.com/impulsonetwork/Atena/_build/latest?definitionId=3)
[![Website](https://img.shields.io/website-up-down-green-red/http/shields.io.svg?label=about)](http://impulso.network)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Twitter Follow](https://img.shields.io/twitter/follow/impulsonetwork.svg?style=social&label=Follow)](https://twitter.com/impulsonetwork)


## Atena v.0.1

Atena is an initiative of the impulse in collaboration with several Impulsers, with the objective to promote the engagement and to reward the activities and efforts of each person in the Impulse. In it you will be able to acquire Experience Points (XP) through the execution of several activities and based on these two factors the Impulsers will receive levels and achievements recognizing the effort expended in the activities.

## Setup

A step-by-step  of the minimal setup you need to get a Atena running.

### Initial configuration

- Install [Mongodb](https://docs.mongodb.com/manual/installation/)
- Create your slack app - [Using ngrok to develop locally for Slack](https://api.slack.com/tutorials/tunneling-with-ngrok)

### Developing

- Make `fork` for your user account, then `clone`
```sh
> git clone https://github.com/[your account]/atena
```

- Navigate to the destination folder
```sh
> cd atena/
```

- Install `yarn` from npm (global is optional)
```sh
> npm i yarn -g
```

- Install repositories using `yarn`
```sh
> yarn -i
```

- Add remote reference
```sh
> git remote add upstream https://github.com/impulsonetwork/atena
```
- Create your .env file using .env.example model
```
PORT=4390
SLACK_SIGNIN_EVENTS=
SLACK_TOKEN=
GA=
MONGODB_URI=mongodb://localhost/atena
CHANNELS=CCWSMJZ6U CCXCXJWBW
```

### Running
- Run the server using the following command:
```sh
> yarn start:dev
```

## Contributing

The main purpose of this repository is to continue to evolve Atena, making it faster and easier to use.

Development of Atena happens in the open on GitHub, and we are grateful to the community for contributing bugfixes and improvements. Read below to learn how you can take part in improving Atena and of Impulso Network.


### [Code of Conduct](CONTRIBUTING.md)

Impulso Network has adopted a Code of Conduct that we expect project participants to adhere to. Please read [Code of Coodult](CONTRIBUTING.md) so that you can understand what actions will and will not be tolerated.

### [Contributing Guide](CONTRIBUTING.md)

Read our [contributing guide](CONTRIBUTING.md) to learn about our development process, how to propose bugfixes and improvements, and how to build and test your changes to Atena.


## Community

All feedback and suggestions are welcome!

💬 Join the community on [Impulso Network](https://impulso.network)

## Contributors

This project exists thanks to all the people who contribute:

<p>
<img src="https://ca.slack-edge.com/T7ZU9V5S6-UCJA2A8Q5-1641bfb963de-48" width="60px">
<img src="https://ca.slack-edge.com/T7ZU9V5S6-UB348CP6Z-0c38a12a4dc6-48" width="60px">
<img src="https://ca.slack-edge.com/T7ZU9V5S6-U9670TYSJ-81d8f97e5554-48" width="60px">
<img src="https://ca.slack-edge.com/T7ZU9V5S6-U7ZD2FCBB-38b85b8fe171-48" width="60px">
<img src="https://ca.slack-edge.com/T7ZU9V5S6-UAR3DR2AV-g611e782a6b7-48" width="60px">
<img src="https://ca.slack-edge.com/T7ZU9V5S6-UCDNR1N59-5ae8f8e81f9f-48" width="60px">
<img src="https://ca.slack-edge.com/T7ZU9V5S6-UCJPCNB70-28c3b996d546-48" width="60px">
</p>

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.