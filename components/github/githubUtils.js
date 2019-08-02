import messages from './githubMessages'

const getId = data => {
  return data.pull_request && data.pull_request.merged
    ? data.pull_request.user.id
    : data.sender.id
}

const getType = data => {
  let type = null
  if (data.issue && data.action === 'opened') type = 'issue'
  if (data.review) type = 'review'
  if (data.pull_request) type = getPullRequestType(data.action)
  return type
}

const getPullRequestType = action => {
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

const getStartUrl = rocketId => {
  const url = `${process.env.GITHUB_OAUTH_URL}authorize?scope=user:email&client_id=${process.env.GITHUB_CLIENT_ID}`
  return `${url}&state=${rocketId}`
}

const getMessages = (type, items = {}) => {
  let message = messages[type]
  const params = Object.entries(items)

  if (message && params.length) {
    params.map(param => {
      message = message.replace(`%${param[0]}%`, param[1])
    })
  }

  return message || ''
}

const getRepositoryIdByMessage = message => {
  const items = message.split(' ')
  return items.length > 1 ? items[1] : false
}

const getUserByMessage = message => {
  const items = message.split(' ')
  const username = items.length > 2 ? items[2].split('@') : false
  return username.length ? username[1] : false
}

export default {
  getStartUrl,
  getPullRequestType,
  getType,
  getId,
  getMessages,
  getRepositoryIdByMessage,
  getUserByMessage
}
