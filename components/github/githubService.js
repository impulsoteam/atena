import config from 'config-yml'
import axios from 'axios'
import queryString from 'querystring'
import messages from '../messages'
import dal from './githubDAL'

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
  const normalizeTypes = {
    issue: normalizeIssue(data),
    review: normalizeReview(data),
    pull_request: normalizePullRequest(data),
    merged_pull_request: normalizeMergedPullRequest(data)
  }

  return {
    ...normalizeCommon(data),
    ...normalizeTypes[data.type]
  }
}

const sendMessage = async user => {
  const response = {
    msg: `Olá @${user.username} acabou de ganhar pontos ao contribuir nos nossos projetos open source`
  }

  messages.sendToRoom(response, 'open-source')
}

const isValidRepository = async repositoryId => {
  const repositories = await dal.findAllRepositories()
  return repositories.includes(repositoryId)
}

const isExcludedUser = async (repositoryId, userId) => {
  return dal.findExcludedUser(repositoryId, userId)
}

const getAccessToken = async code => {
  const url = `${process.env.GITHUB_OAUTH_URL}access_token`
  let res = await axios.post(url, {
    client_id: process.env.GITHUB_CLIENT_ID,
    client_secret: process.env.GITHUB_CLIENT_SECRET,
    code: code,
    accept: 'json'
  })

  return await queryString.parse(res.data)
}

const getUserInfo = async accessToken => {
  return axios.get(`${process.env.GITHUB_API_URL}user`, {
    params: {
      access_token: accessToken
    }
  })
}

export default {
  isExcludedUser,
  normalize,
  sendMessage,
  isValidRepository,
  getAccessToken,
  getUserInfo
}
