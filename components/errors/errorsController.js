import logs from '../logs'

const _throw = (file, method, error) => {
  console.log('error', error)
  const text = error.message || error
  _log(file, method, text)
}

const _log = (file, method, text) => {
  logs.info(
    '\x1b[31m',
    '\n',
    `[${file.toUpperCase()}] Error on ${method}: `,
    text,
    '\n'
  )
}

export default {
  _throw,
  _log
}
