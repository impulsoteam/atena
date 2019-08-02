const enabled = process.env.ATENA_ENABLE_LOGS || false

const info = (text, ...rest) => {
  if (enabled) console.info(text, ...rest)
}

export default {
  info
}
