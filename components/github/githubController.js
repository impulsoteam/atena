import service from './githubService'
import utils from './githubUtils'
import errors from '../errors'
import { save, getRepository } from './githubDAL'
import users from '../users'
import interactions from '../interactions'

const file = 'Github | Controller'

const auth = async data => {
  try {
    let response = 'Ops! Não conseguimos responder a esse comando agora. :/'
    const user = await users.findOne({ rocketId: data.u._id })
    if (!user) {
      response = utils.getMessages('firstInteraction')
    } else if (!user.githubId) {
      const authUrl = utils.getStartUrl(user.rocketId)
      response = utils.getMessages('noPermission', {
        username: user.name,
        url: authUrl
      })
    } else {
      response = utils.getMessages('letsWork', {
        username: user.name
      })
    }

    return { msg: response }
  } catch (e) {
    errors._throw(file, 'auth', e)
  }
}

const addUser = async (githubCode, rocketId) => {
  try {
    const url = process.env.ATENA_URL
    let response = {
      redirect: `${url}/github/error`
    }

    const user = await users.findOne({ rocketId: rocketId })
    if (user) {
      let data = await service.getAccessToken(githubCode)

      if (data.access_token) {
        const githubInfo = await service.getUserInfo(data.access_token)
        user.githubId = githubInfo.data.id
        await users.save(user)

        response.redirect = `${url}/github/success`
      } else if (data.error) {
        const authUrl = utils.getStartUrl(rocketId)
        response.redirect = `${url}/github/retry?url=${authUrl}`
      }
    }

    return response
  } catch (e) {
    errors._throw(file, 'auth', e)
  }
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

const handle = async data => {
  // @todo - add secret on github webhook
  // console.log('data', data)
  const repositoryId = data.repository.id.toString()
  data.origin = 'github'

  data.type = utils.getType(data)
  if (!data.type) {
    return { error: 'Tipo incorreto de interação' }
  }

  const isValid = await service.isValidRepository(repositoryId)
  if (!isValid) {
    return { error: 'Repositório Inválido' }
  }

  const githubId = utils.getId(data)
  const user = await users.find({ githubId: githubId })
  if (!user) return { error: 'Usuário Inválido' }
  data.user = user.rocketId

  const hasPermission = await service.isExcludedUser(repositoryId, user._id)
  if (!hasPermission) {
    return {
      error: 'Esse usuário não faz parte do time, não pode pontuar'
    }
  }

  const interactionData = service.normalize(data)
  const interaction = interactions.handle(interactionData)

  data.interaction = interaction
  if (interaction.score > 0) service.sendMessage(user)

  return data
}

export default {
  handle,
  auth,
  addUser
}
