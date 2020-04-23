// import Message from '../models/Message'
import User from '../models/User'
import Reaction from '../models/Reaction'
import LogController from '../controllers/LogController'

class ReactionController {
  async handle(payload) {
    try {
      const { provider, reactions } = payload

      const reactionsSaved = await Reaction.find({
        'provider.messageId': provider.messageId
      })

      if (reactionsSaved.length > reactions.length) {
        const reactionsRemoved = this.findReactions({
          mostReactions: reactionsSaved,
          lessReactions: reactions
        })
        this.removeReactions(reactionsRemoved)
      }

      if (reactionsSaved.length < reactions.length) {
        const reactionsAdded = this.findReactions({
          mostReactions: reactions,
          lessReactions: reactionsSaved
        })
        this.saveReactions(reactionsAdded)
      }
    } catch (error) {
      LogController.sendError(error)
    }
  }

  findReactions({ mostReactions, lessReactions }) {
    const reactions = []
    for (const reaction of mostReactions) {
      const { provider, content } = reaction
      const duplicated = lessReactions.find(
        reaction =>
          reaction.content === content &&
          reaction.provider.username === provider.username
      )
      if (duplicated) continue
      reactions.push(reaction)
    }
    return reactions
  }

  async saveReactions(reactionsAdded) {
    for (const reaction of reactionsAdded) {
      const { provider } = reaction
      const user = await User.findOne({
        [`${provider.name}.username`]: provider.username
      })
      if (user) reaction.user = user.uuid
      await Reaction.create(reaction)
    }
  }

  async removeReactions(reactionsRemoved) {
    for (const reaction of reactionsRemoved) {
      await Reaction.deleteOne({ _id: reaction._id })
    }
  }
}

export default new ReactionController()
