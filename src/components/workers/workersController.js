import service from './workersService'

const amqplib = require('amqplib/callback_api')
const url = process.env.CLOUDAMQP_URL

const exec = () => {
  receive()
}

const receive = () => {
  amqplib.connect(url, (error, conn) => {
    if (error != null) service.onError(error)
    service.consumer(conn)
  })
}

const publish = data => {
  if (url) {
    amqplib.connect(url, (error, conn) => {
      if (error != null) service.onError(error)
      service.publisher(conn, data)
    })
  }
}

export default {
  exec,
  publish
}
