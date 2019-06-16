import rocket from '../rocket'
import errors from '../errors'

const exec = async () => {
  console.log('Entrou no bot')
  try {
    await rocket.exec()
  } catch (e) {
    errors._throw('bots | controller', 'exec', e)
  }
}

export default {
  exec
}
