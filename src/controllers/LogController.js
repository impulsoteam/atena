import moment from 'moment'
import Pretty from 'pretty-error'

const { SLACK_LOG, SLACK_CHANNEL, NODE_ENV } = process.env
const slack = require('slack-notify')(SLACK_LOG)
slack.onError = function (err) {
  console.log('API error:', err)
}

class LogController {
  sendNotify({ file, resume, details }) {
    const text = JSON.stringify(details, null, '  ')
    const attachments = [
      {
        fallback: 'Error while rendering message',
        pretext: `*${file}*`,
        title: resume.replace(/  +/g, ''),
        color: '#3498db',
        text: `${'```'}${text}${'```'}`,
        ts: moment().format('X')
      }
    ]
    this.sendSlackMessage(attachments)
    console.log({ file, resume, details })
  }

  sendError(error) {
    const text =
      error instanceof Error
        ? new Pretty().withoutColors().render(error)
        : JSON.stringify(error, null, 2)

    const attachments = [
      {
        fallback: 'Error while rendering message',
        color: '#e74c3c',
        text: `${'```'}${text}${'```'}`,
        ts: moment().format('X')
      }
    ]

    this.sendSlackMessage(attachments)

    console.log(error instanceof Error ? new Pretty().render(error) : error)
  }

  sendSlackMessage(attachments) {
    slack.send({
      channel: SLACK_CHANNEL,
      icon_url: 'https://impulsowork.slack.com/services/BLA0E0RA5',
      username: `Atena - [${NODE_ENV}]`,
      attachments
    })
  }
}

export default new LogController()
