import { getUserInfoByUsername } from '../rocket/api'
import { _throw } from '../helpers'

export const isPositiveReaction = interaction => {
  return (
    interaction.description === '+1' || interaction.description === ':thumbsup:'
  )
}

export const isNegativeReaction = interaction => {
  return (
    interaction.description === '-1' ||
    interaction.description === ':thumbsdown:'
  )
}

export const isAtenaReaction = interaction => {
  return (
    interaction.description === 'atena' || interaction.description === ':atena:'
  )
}

export const getUserFromReaction = async data => {
  try {
    const reaction = Object.keys(data.reactions).pop()

    let username
    if (reaction) {
      username = data.reactions[reaction].usernames.pop()
    }

    let user
    if (username) {
      user = await getUserInfoByUsername(username)
    }

    return {
      id: user ? user._id : null,
      username: user ? user.username : null,
      name: user ? user.name : null
    }
  } catch (error) {
    _throw('Error on finding user by reaction')
  }
}
