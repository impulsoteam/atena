import crypto from 'crypto-js'
import errors from '../errors'

const salt = process.env.ATENA_CRYPTO_SALT
const file = 'Cryto | Controller'

const encrypt = async data => {
  try {
    return crypto.AES.encrypt(JSON.stringify(data), salt).toString()
  } catch (e) {
    errors._throw(file, 'auth', e)
    return e
  }
}

const decrypt = async data => {
  try {
    var bytes = crypto.AES.decrypt(data, salt)
    return JSON.parse(bytes.toString(crypto.enc.Utf8))
  } catch (e) {
    errors._throw(file, 'auth', e)
    return e
  }
}

export default {
  encrypt,
  decrypt
}
