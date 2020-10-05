import { sendError } from 'log-on-slack'

const mailJet = require('node-mailjet').connect(
  process.env.MJ_APIKEY_PUBLIC,
  process.env.MJ_APIKEY_PRIVATE
)

export const updateContacts = async Contacts => {
  try {
    await mailJet
      .post('contact', { version: 'v3' })
      .action('managemanycontacts')
      .request({ Contacts })
  } catch (error) {
    sendError({
      file: 'services/mailJet.js - updateContacts',
      payload: {
        firstContact: Contacts[0],
        count: Contacts.length
      },
      error
    })
  }
}
