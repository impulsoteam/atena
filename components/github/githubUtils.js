const getId = data => {
  return data.pull_request && data.pull_request.merged
    ? data.pull_request.user.id
    : data.sender.id
}

const getType = data => {
  let type = null
  if (data.issue) type = 'issue'
  if (data.review) type = 'review'
  if (data.pull_request) type = getTypeByAction(data.action)
  return type
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

const getStartUrl = rocketId => {
  const url = `${process.env.GITHUB_OAUTH_URL}authorize?scope=user:email&client_id=${process.env.GITHUB_CLIENT_ID}`
  return `${url}&state=${rocketId}`
}

export default {
  getStartUrl,
  getTypeByAction,
  getType,
  getId
}
