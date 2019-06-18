const isChatInteraction = interaction =>
  interaction.origin == 'rocket' ||
  interaction.type === 'manual' ||
  interaction.type === 'inactivity'

const isPositiveReaction = interaction =>
  interaction.description === '+1' || interaction.description === ':thumbsup:'

const isNegativeReaction = interaction =>
  interaction.description === '-1' || interaction.description === ':thumbsdown:'

const isAtenaReaction = interaction =>
  interaction.description === 'atena' || interaction.description === ':atena:'

const isGithubInteraction = interaction =>
  interaction.category === 'network' && interaction.action === 'github'

const getRoomToSendMessage = interaction => {
  let room = interaction.channelName
  if (!room) room = getRoomByInteraction(interaction)
  return room
}

const getRoomByInteraction = interaction => {
  let room = 'impulso-network'
  if (isGithubInteraction(interaction)) room = 'open-source'
  return room
}

export default {
  isChatInteraction,
  isPositiveReaction,
  isNegativeReaction,
  isAtenaReaction,
  isGithubInteraction,
  getRoomToSendMessage
}
