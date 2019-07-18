import linkedin from '../linkedin'

const auth = async data => {
  if (data.type === 'linkedin') {
    return linkedin.auth(data.code)
  } else {
    return linkedin.auth({ user: '', password: '' })
  }
}

export default {
  auth
}
