const _throw = (file, method, error) => {
  const text = error.message || error
  _log(file, method, text)
}

const _log = (file, method, text) => {
  console.log(
    '\x1b[31m',
    '\n\n',
    `[${file.toUpperCase()}] Error on ${method}: `,
    text,
    '\n\n'
  )
}

export default {
  _throw,
  _log
}
