import config from 'config-yml'
import { driver } from '@rocket.chat/sdk'
import { dal as interactionDAL } from '../interactions'

const getId = data => {
  return data.pull_request && data.pull_request.merged
    ? data.pull_request.user.id
    : data.sender.id
}

const getTypeByAction = action => {
  let res = null
  switch (action) {
    case 'closed':
      res = 'merged_pull_request'
      break
    case 'opened':
      res = 'pull_request'
      break
  }
  return res
}

const getType = data => {
  let type = null
  if (data.issue) type = 'issue'
  if (data.review) type = 'review'
  if (data.pull_request) type = defaultFunctions.getTypeByAction(data.action)
  return type
}

const normalizeCommon = data => {
  return {
    origin: data.origin,
    type: data.type,
    user: data.user,
    thread: false,
    action: config.actions.github.type,
    category: config.categories.network.type
  }
}

const normalizeIssue = data => {
  return {
    description: 'new github issue',
    channel: data.repository.id,
    score: config.xprules.github.issue
  }
}

const normalizeReview = data => {
  return {
    description: 'review',
    channel: data.review.id,
    score: config.xprules.github.review
  }
}

const normalizePullRequest = data => {
  return {
    description: 'review',
    channel: data.pull_request.id,
    score: config.xprules.github.pull_request
  }
}

const normalizeMergedPullRequest = data => {
  return {
    description: 'merged pull request',
    channel: data.pull_request.id,
    score: config.xprules.github.merged_pull_request
  }
}

const normalize = data => {
  let response = {}
  if (data.type === 'issue') response = defaultFunctions.normalizeIssue(data)
  if (data.type === 'review') response = defaultFunctions.normalizeReview(data)
  if (data.type === 'pull_request')
    response = defaultFunctions.normalizePullRequest(data)
  if (data.type === 'merged_pull_request')
    response = defaultFunctions.normalizeMergedPullRequest(data)

  return {
    ...normalizeCommon(data),
    ...response
  }
}

const interactionSave = async data => {
  return interactionDAL.save(data)
}

const sendOnRocket = async user => {
  const response = {
    msg: `Olá @${
      user.username
    } acabou de ganhar pontos ao contribuir nos nossos projetos open source`
  }
  driver.sendToRoom(response, 'open-source')
}

const sendMessage = async user => {
  sendOnRocket(user)
}

const defaultFunctions = {
  getType,
  getId,
  normalize,
  normalizePullRequest,
  normalizeReview,
  normalizeMergedPullRequest,
  normalizeIssue,
  getTypeByAction,
  interactionSave,
  sendMessage
}

export default defaultFunctions
