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

export default {
  isChatInteraction,
  isPositiveReaction,
  isNegativeReaction,
  isAtenaReaction
}
