import Reaction from './reaction'
import Interaction from '../interactions/interaction'
import User from '../users/user'

const handle = async message => {
  const interaction = await Interaction.findOne({ messageId: message._id })
  const reactions = await Reaction.find({
    interaction: interaction._id
  })
  const reactionsMatrix = rocketchatReactionsMatrix(message)

  if (reactionsMatrix.length > reactions.length) {
    const addedReactions = reactionsMatrix.filter(m => {
      return !reactions.find(r => {
        return r.username === m.username && r.reaction === m.reaction
      })
    })

    if (addedReactions.length === 0) return
    const { username, reaction } = addedReactions[0]
    const user = await User.findOne({ username })
    await Reaction.create({
      user: user._id,
      interaction: interaction._id,
      reaction,
      username,
      score: 0
    })
  } else {
    const removedReactions = reactions.filter(r => {
      return !reactionsMatrix.find(m => {
        return m.username === r.username && m.reaction === r.reaction
      })
    })

    if (removedReactions.length === 0) return
    await removedReactions[0].delete()
  }
}

const rocketchatReactionsMatrix = message => {
  return Object.keys(message.reactions)
    .map(reaction => {
      return message.reactions[reaction].usernames.map(username => {
        return { username, reaction }
      })
    })
    .flat()
}

export default {
  handle
}

function logg(message) {
  console.log('========================================')
  console.log(JSON.stringify(message, null, 2))
  console.log('========================================')
}
