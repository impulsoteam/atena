'use strict'
import { driver } from '@rocket.chat/sdk'
import service from './githubService'
import { isValidRepository, save } from './githubDAL'
import userController from '../../controllers/user'
// import interactionController from "../../controllers/interaction"

const link_auth = `${
  process.env.GITHUB_OAUTH_URL
}authorize?scope=user:email&client_id=${process.env.GITHUB_CLIENT_ID}`

const auth = async req => {
  let response = { msg: '' }
  const username = req.u.username
  const rocketId = req.u._id
  userController
    .findBy({ rocketId: rocketId })
    .then(user => {
      response.msg = `Olá! Leal, ${
        user.name
      }, você já pode participar dos meus trabalhos open-source! Go coding!`
      if (!user.githubId) {
        return Promise.reject(
          `Olá! Parece que você ainda não pertence as nossas fileiras, Impulser! Mas você não viria tão longe se não quisesse participar dos trabalhos com open-source, certo?!
Portanto, tens o que é preciso para estar entre nós, ${
            user.name
          }! Mas para participar dos trabalhos com open-source, preciso que vá até o seguinte local: ${link_auth}&state=${rocketId}. Uma vez que conclua essa missão voltaremos a conversar!`
        )
      }
    })
    .catch(err => {
      response.msg = err
      if (err === 'Usuário não encontrado') {
        response.msg =
          'Opa! essa é a primeira interação na Atena, por favor depois das mensagem de boas vindas, repita o comando *!opensource*'
      }
    })
    .then(() => {
      driver.sendDirectToUser(response, username)
    })
}

const add = async req => {
  let response = { msg: 'Não foi possível adicionar esse repositório.' }
  const username = req.u.username
  const rocketId = req.u._id
  const repositoryId = req.msg.split(' ')[1]
  userController
    .findBy({ rocketId: rocketId })
    .then(user => {
      if (!user.isCoreTeam) {
        return Promise.reject('Você não é do coreteam.')
      }
      return !isValidRepository(repositoryId)
    })
    .then(() => {
      response.msg = 'Repositório Adicionado'
      return save({ repositoryId: repositoryId })
    })
    .catch(err => {
      response.msg = err
      if (err.code === 11000) {
        response.msg = 'Repositório já existe na nossa database'
      }
    })
    .then(() => {
      driver.sendDirectToUser(response, username)
    })
}

const events = async (req, res) => {
  // @todo - add secret on github webhook
  let data = req.body
  const repositoryId = req.body.repository.id.toString()
  data.origin = 'github'
  data.type = service.getType(data)
  const githubId = service.getId(data)
  userController
    .findBy({ githubId: githubId })
    .then(user => {
      data.user = user.rocketId
      return isValidRepository(repositoryId)
    })
    .then(response => {
      return response
    })
    .catch(error => {
      data.error = error
    })
    .then(() => {
      res.json(data)
    })
  /*
  if (
    isValidRepository(repository) &&
    !config.atenateam.members.includes(user.rocketId) &&
    valid(data)
  ) {
    interactionController.save(data);
  } else {
    console.log(`\n-- event into an invalid repository ${repository}`);
  }
  */
}

const defaultFunctions = {
  events,
  auth,
  add
}

export default defaultFunctions
