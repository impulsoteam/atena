import LogController from '../controllers/LogController'
import Reaction from '../models/Reaction'
import User from '../models/User'
import ScoreController from './ScoreController'

class ReactionController {
  async handle(payload) {
    console.log({ payload })
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
        this.saveReactions({ reactionsAdded, payload })
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

  async saveReactions({ reactionsAdded, payload }) {
    for (const reaction of reactionsAdded) {
      const { provider } = reaction
      const user = await User.findOne({
        [`${provider.name}.username`]: provider.username
      })

      if (user) reaction.user = user.uuid

      await Reaction.create(reaction)
      ScoreController.handleReaction({ reaction, payload })
    }
  }

  async removeReactions(reactionsRemoved) {
    for (const reaction of reactionsRemoved) {
      await Reaction.deleteOne({ _id: reaction._id })
    }
  }
}

export default new ReactionController()
