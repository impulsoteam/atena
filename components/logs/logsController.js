const enabled = process.env.ENABLE_LOGS || false

const show = text => {
  if (enabled) console.log(text)
}

export default {
  show
}
