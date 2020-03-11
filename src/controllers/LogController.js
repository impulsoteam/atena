import moment from 'moment'
import Pretty from 'pretty-error'

const { SLACK_LOG, SLACK_CHANNEL, NODE_ENV } = process.env
const slack = require('slack-notify')(SLACK_LOG)
slack.onError = function(err) {
  console.log('API error:', err)
}

class LogController {
  sendNotify({ type, file, resume, details }) {
    const text =
      type === 'error'
        ? new Pretty().withoutColors().render(details)
        : JSON.stringify(details, null, '  ')

    this.sendSlackMessage({ type, file, resume, details, text })

    console.log(new Pretty().render(details), {
      type,
      file,
      resume,
      details
    })
  }

  sendSlackMessage({ type, file, resume, details, text }) {
    slack.send({
      channel: SLACK_CHANNEL,
      icon_url: 'https://impulsowork.slack.com/services/BLA0E0RA5',
      username: `Atena - [${NODE_ENV}]`,
      attachments: [
        {
          fallback: 'Error while rendering message',
          pretext: `*${file}*`,
          title: resume ? resume.replace(/  +/g, '') : 'unknown error',
          color: type === 'error' ? '#e74c3c' : '#3498db',
          text: details ? `${'```'}${text}${'```'}` : null,
          ts: moment().format('X')
        }
      ]
    })
  }
}

export default new LogController()
