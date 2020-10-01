import { sendError } from 'log-on-slack'

const { DRIP_API_KEY, DRIP_ACCOUNT_ID } = process.env
const client = require('drip-nodejs')({
  token: DRIP_API_KEY,
  accountId: DRIP_ACCOUNT_ID
})

export const sendBatchOfUsersToDrip = subscribers => {
  const batch = {
    batches: [{ subscribers }]
  }

  client.updateBatchSubscribers(batch, error => {
    if (error) {
      sendError({
        file: 'services/drip.js - handleEvent',
        payload: subscribers,
        error
      })
    }
  })
}
