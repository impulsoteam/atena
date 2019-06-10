'use strict'
import { driver } from '@rocket.chat/sdk'
import service from './githubService'
import {
  isValidRepository,
  save,
  isExcludedUser,
  getRepository
} from './githubDAL'
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

const addExcludedUser = async req => {
  let response = { msg: 'Não foi possível adicionar o usuário ao repositório.' }
  const username = req.u.username
  const rocketId = req.u._id
  const excludedUsername = req.msg.split(' ')[1].split('@')[1]
  const repositoryId = req.msg.split(' ')[2]
  let repository = null
  userController
    .findBy({ rocketId: rocketId })
    .then(user => {
      if (!user.isCoreTeam) {
        return Promise.reject('Você não é do coreteam.')
      }
      return !isValidRepository(repositoryId)
    })
    .then(() => {
      return getRepository(repositoryId)
    })
    .then(res => {
      repository = res
      return userController.findBy({ username: excludedUsername })
    })
    .then(user => {
      repository.excludedUsers.push({ userId: user._id })
      return repository.save()
    })
    .then(() => {
      response.msg = `Usuário @${excludedUsername} adicionado com sucesso`
      return response.msg
    })
    .catch(err => {
      response.msg = err
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
  let userModel = {}
  const repositoryId = req.body.repository.id.toString()
  data.origin = 'github'
  data.type = service.getType(data)
  const githubId = service.getId(data)
  isValidRepository(repositoryId)
    .then(valid => {
      if (!valid) {
        return Promise.reject('Repositório Inválido')
      }
      return valid
    })
    .then(() => {
      return userController.findBy({ githubId: githubId })
    })
    .then(user => {
      // @todo change it to user.id in next version.
      userModel = user
      data.user = user.rocketId
      return isExcludedUser(repositoryId, user._id)
    })
    .then(isExcludedUser => {
      if (isExcludedUser) {
        return Promise.reject(
          'Esse usuário faz parte do time, não pode pontuar'
        )
      }
      return isExcludedUser
    })
    .then(() => {
      if (!data.type) {
        return Promise.reject('Tipo incorreto de interação')
      }
      data = service.normalize(data)
      return data
    })
    .then(data => {
      return service.interactionSave(data)
    })
    .then(interaction => {
      data.interaction = interaction
      if (interaction.score > 0) {
        service.sendMessage(userModel)
      }
      return interaction
    })
    .catch(error => {
      data.error = error
    })
    .then(() => {
      res.json(data)
    })
}

const defaultFunctions = {
  events,
  auth,
  add,
  addExcludedUser
}

export default defaultFunctions
