import linkedin from '../linkedin'
import rocket from '../rocket'

const auth = async data => {
  if (data.type === 'linkedin') {
    return linkedin.auth(data.code)
  } else {
    return rocket.auth(data.user, data.password)
  }
}

export default {
  auth
}
