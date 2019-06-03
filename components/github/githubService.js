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
  if (data.pull_request) type = getTypeByAction(data.action)
  return type
}

export default {
  getType,
  getId
}
