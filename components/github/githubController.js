import service from './githubService'
import utils from './githubUtils'
import { save, getRepository } from './githubDAL'
import users from '../users'
import interactions from '../interactions'

const auth = async req => {
  const rocketId = req.u._id
  const user = users.find({ rocketId: rocketId })
  if (!user) {
    return {
      msg:
        'Opa! essa é a primeira interação na Atena, por favor depois das mensagem de boas vindas, repita o comando *!opensource*'
    }
  }

  let response = {}
  if (!user.githubId) {
    const authUrl = utils.getStartUrl(rocketId)
    response.msg = `Olá! Parece que você ainda não pertence as nossas fileiras, Impulser! Mas você não viria tão longe se não quisesse participar dos trabalhos com open-source, certo?!
Portanto, tens o que é preciso para estar entre nós, ${user.name}! Mas para participar dos trabalhos com open-source, preciso que vá até o seguinte local: ${authUrl}. Uma vez que conclua essa missão voltaremos a conversar!`
  } else {
    response.msg = `Olá! Leal, ${user.name}, você já pode participar dos meus trabalhos open-source! Go coding!`
  }

  return response
}

// const addExcludedUser = async req => {
//   let response = { msg: 'Não foi possível adicionar o usuário ao repositório.' }
//   const username = req.u.username
//   const rocketId = req.u._id
//   const excludedUsername = req.msg.split(' ')[1].split('@')[1]
//   const repositoryId = req.msg.split(' ')[2]
//   let repository = null
//   usersController
//     .find({ rocketId: rocketId })
//     .then(user => {
//       if (!user.isCoreTeam) {
//         return Promise.reject('Você não é do coreteam.')
//       }
//       return !isValidRepository(repositoryId)
//     })
//     .then(() => {
//       return getRepository(repositoryId)
//     })
//     .then(res => {
//       repository = res
//       return usersController.find({ username: excludedUsername })
//     })
//     .then(user => {
//       repository.excludedUsers.push({ userId: user._id })
//       return repository.save()
//     })
//     .then(() => {
//       response.msg = `Usuário @${excludedUsername} adicionado com sucesso`
//       return response.msg
//     })
//     .catch(err => {
//       response.msg = err
//     })
//     .then(() => {
//       driver.sendDirectToUser(response, username)
//     })
// }

// const add = async req => {
//   let response = { msg: 'Não foi possível adicionar esse repositório.' }
//   const username = req.u.username
//   const rocketId = req.u._id
//   const repositoryId = req.msg.split(' ')[1]
//   usersController
//     .find({ rocketId: rocketId })
//     .then(user => {
//       if (!user.isCoreTeam) {
//         return Promise.reject('Você não é do coreteam.')
//       }
//       return !isValidRepository(repositoryId)
//     })
//     .then(() => {
//       response.msg = 'Repositório Adicionado'
//       return save({ repositoryId: repositoryId })
//     })
//     .catch(err => {
//       response.msg = err
//       if (err.code === 11000) {
//         response.msg = 'Repositório já existe na nossa database'
//       }
//     })
//     .then(() => {
//       driver.sendDirectToUser(response, username)
//     })
// }

// const handle = async data => {
//   // @todo - add secret on github webhook
//   // console.log('data', data)
//   const repositoryId = data.repository.id.toString()
//   data.origin = 'github'

//   data.type = utils.getType(data)
//   if (!data.type) {
//     return { error: 'Tipo incorreto de interação' }
//   }

//   const isValid = await service.isValidRepository(repositoryId)
//   if (!isValid) {
//     return { error: 'Repositório Inválido' }
//   }

//   const githubId = utils.getId(data)
//   const user = await users.find({ githubId: githubId })
//   if (!user) return { error: 'Usuário Inválido' }
//   data.user = user.rocketId

//   const hasPermission = await service.isExcludedUser(repositoryId, user._id)
//   if (!hasPermission) {
//     return {
//       error: 'Esse usuário não faz parte do time, não pode pontuar'
//     }
//   }

//   const interactionData = service.normalize(data)
//   const interaction = interactions.handle(interactionData)

//   data.interaction = interaction
//   if (interaction.score > 0) service.sendMessage(user)

//   return data
// }

export default {
  auth
}
