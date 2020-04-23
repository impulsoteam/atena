import crypto from 'crypto-js'
import LogController from '../controllers/LogController'

const salt = process.env.ATENA_CRYPTO_SALT

export const encrypt = async data => {
  try {
    return crypto.AES.encrypt(JSON.stringify(data), salt).toString()
  } catch (error) {
    LogController.sendError(error)
    return error
  }
}

export const decrypt = async data => {
  try {
    var bytes = crypto.AES.decrypt(data, salt)
    return JSON.parse(bytes.toString(crypto.enc.Utf8))
  } catch (error) {
    LogController.sendError(error)
    return error
  }
}
