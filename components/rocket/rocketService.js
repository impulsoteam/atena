const isValidMessage = (botId, message, messageOptions) => {
  return message.u._id === botId || message.t || messageOptions.roomType === 'd'
}

export default {
  isValidMessage
}
