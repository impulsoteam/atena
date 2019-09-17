const apiBaseUrl = (() => {
  const useSsl = process.env.ROCKETCHAT_USE_SSL === 'true'
  const httpBase = useSsl ? 'https://' : 'http://'
  return `${httpBase}${process.env.ROCKETCHAT_URL}/api/v1`
})()

export default {
  apiBaseUrl
}
