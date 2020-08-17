import dotenv from 'dotenv'
import moment from 'moment'
import Pretty from 'pretty-error'
import slackApi from 'slack'

dotenv.config()
const {
  NODE_ENV: nodeEnv,
  SLACK_TOKEN: token,
  SLACK_LOG_CHANNEL: channel
} = process.env

const params = {
  token,
  channel,
  // eslint-disable-next-line camelcase
  icon_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/gt/128.jpg',
  username: `Atena - [${nodeEnv}]`
}

export const sendNotify = ({ file, resume, details }) => {
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

  slackApi.chat.postMessage({ attachments, ...params })
  console.log({ file, resume, details })
}

export const sendError = async ({ file, payload, error }) => {
  const formattedError = new Pretty().withoutColors().render(error)

  const blocks = [
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `*Something went wrong in ${file}*`
      }
    }
  ]

  const attachments = [
    {
      fallback: 'Error while rendering message',
      pretext: '*Error*',
      color: '#e74c3c',
      text: `${'```'}${formattedError}${'```'}`,
      ts: moment().format('X')
    }
  ]

  if (payload) {
    attachments.push({
      fallback: 'Error while rendering message',
      pretext: '*Payload*',
      color: '#023e7d',
      text: `${'```'}${JSON.stringify(payload, null, 2)}${'```'}`
    })
  }

  const options = {
    ...params,
    text: `New error in ${file}`,
    attachments,
    blocks
  }

  const { messages } = await slackApi.conversations.history({
    oldest: moment().startOf('day').format('X'),
    latest: moment().endOf('day').format('X'),
    ...params
  })

  for (const message of messages) {
    if (message.text === options.text) {
      // eslint-disable-next-line camelcase
      options.thread_ts = message.ts
      break
    }
  }

  slackApi.chat.postMessage(options)

  console.log(new Pretty().render(error))
}
