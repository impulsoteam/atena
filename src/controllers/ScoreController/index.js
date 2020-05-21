import moment from 'moment'

import { achievementTypes } from '../../config/achievements'
import { scoreRules } from '../../config/score'
import Reaction from '../../models/Reaction'
import Score from '../../models/Score'
import { scoreTypes } from '../../models/Score/schema'
import User from '../../models/User'
import AchievementController from '../AchievementController'
import LogController from '../LogController'
import ScoreUtils from './utils'

class ScoreController extends ScoreUtils {
  async handleMessage({ payload, message, user }) {
    try {
      if (await this.messageCannotScore({ payload, message, user })) return user

      const description = message.provider.parentId
        ? scoreTypes.threadAnswered
        : scoreTypes.messageSent

      const scoreEarned =
        description === scoreTypes.messageSent
          ? scoreRules.message.send
          : scoreRules.thread.send

      await Score.create({
        user: user.uuid,
        score: scoreEarned,
        description,
        details: {
          provider: message.provider.name,
          messageId: message.provider.messageId,
          room: message.provider.room
        }
      })
      return await this.updateUserScore({ user, scoreEarned })
    } catch (error) {
      LogController.sendError(error)
    }
  }

  async handleReaction({ reaction, payload, alreadyAchieved }) {
    const { name, user } = payload.provider

    const sender = await User.findOne({
      [`${name}.username`]: reaction.provider.username
    })
    if (sender)
      this.scoreReactionSended({ sender, reaction, payload, alreadyAchieved })

    const receiver = await User.findOne({ [`${name}.username`]: user.username })
    if (receiver)
      this.scoreReactionReceived({
        receiver,
        reaction,
        payload,
        alreadyAchieved
      })
  }

  async scoreReactionSended(data) {
    const { sender, reaction, payload, alreadyAchieved } = data

    if (await this.reactionSendedCannotScore({ reaction, payload })) return
    await Score.create({
      user: sender.uuid,
      score: scoreRules.reaction.send,
      description: scoreTypes.reactionSended,
      details: {
        provider: reaction.provider.name,
        messageId: reaction.provider.messageId,
        content: reaction.content
      }
    })
    const updatedSender = await this.updateUserScore({
      user: sender,
      scoreEarned: scoreRules.reaction.send
    })

    if (!alreadyAchieved)
      AchievementController.handle({
        user: updatedSender,
        achievementType: achievementTypes.reactionSended,
        provider: reaction.provider.name
      })
  }

  async scoreReactionReceived(data) {
    const { receiver, reaction, payload, alreadyAchieved } = data

    if (await this.reactionReceivedCannotScore({ receiver, reaction, payload }))
      return

    await Score.create({
      user: receiver.uuid,
      score: scoreRules.reaction.receive,
      description: scoreTypes.reactionReceived,
      details: {
        provider: reaction.provider.name,
        messageId: reaction.provider.messageId,
        content: reaction.content,
        sender: reaction.user
      }
    })

    const updatedReceiver = await this.updateUserScore({
      user: receiver,
      scoreEarned: scoreRules.reaction.receive
    })

    if (!alreadyAchieved)
      AchievementController.handle({
        user: updatedReceiver,
        achievementType: achievementTypes.reactionReceived,
        provider: reaction.provider.name
      })
  }

  async handleAchievement({ achievement, user, provider, score: scoreEarned }) {
    try {
      await Score.create({
        user: user.uuid,
        score: scoreEarned,
        description: scoreTypes.newAchievement,
        details: {
          provider,
          achievement: achievement.name,
          medal: achievement.medal,
          range: achievement.range
        }
      })

      await this.updateUserScore({ user, scoreEarned })
    } catch (error) {
      LogController.sendError(error)
    }
  }

  async handleClickOnProduct(payload) {
    const {
      time,
      uuid,
      product,
      provider,
      description,
      achievementType
    } = payload

    const user = await User.findOne({ uuid })

    if (!user)
      return LogController.sendError({
        file: 'ScoreController.handleClickOnProduct',
        resume: `Unable to find user`,
        details: { payload }
      })

    const lastScore = await Score.findOne({
      user: uuid,
      description,
      'details.product': product
    })

    if (lastScore) {
      const currentInteraction = moment(time).utc()
      const lastInteraction = moment(lastScore.createdAt)

      const pastHours = moment
        .duration(currentInteraction.diff(lastInteraction))
        .asHours()

      if (pastHours < scoreRules.clickOnProduct.limit)
        return AchievementController.handle({
          user,
          achievementType,
          provider: provider.name
        })
    }

    const score = scoreRules.clickOnProduct.score

    await Score.create({
      user: user.uuid,
      score,
      description,
      details: {
        provider: provider.name,
        product,
        occurredAt: moment(time).utc()
      }
    })

    const updatedUser = await this.updateUserScore({ user, scoreEarned: score })
    AchievementController.handle({
      user: updatedUser,
      achievementType,
      provider: provider.name
    })
  }

  async handleManualScore({ payload, user }) {
    try {
      await Score.create(payload)
      return await this.updateUserScore({ user, scoreEarned: payload.score })
    } catch (error) {
      LogController.sendError(error)
    }
  }

  async scoreInactivities() {
    try {
      const daysOfInactivity = moment().subtract(
        scoreRules.daysOfInactivity,
        'days'
      )
      const score = scoreRules.inactivityScore
      const inactives = await User.find({
        lastInteraction: { $lt: daysOfInactivity },
        'score.value': { $gt: 1 }
      })

      for (const user of inactives) {
        await Score.create({
          user: user.uuid,
          score,
          description: scoreTypes.inactivity
        })
        await this.updateUserScore({ user, scoreEarned: score })
      }
    } catch (error) {
      LogController.sendError(error)
    }
  }

  async removeScoreFromReaction({ reaction, payload }) {
    const { deletedCount } = await Score.deleteMany({
      description: scoreTypes.reactionSended,
      'details.messageId': reaction.provider.messageId,
      'details.content': reaction.content,
      user: reaction.user
    })

    if (!deletedCount) return

    await Score.deleteMany({
      description: scoreTypes.reactionReceived,
      'details.messageId': reaction.provider.messageId,
      'details.content': reaction.content,
      'details.sender': reaction.user
    })
    const { name, user } = payload.provider

    const sender = await User.findOne({
      [`${name}.username`]: reaction.provider.username
    })

    const updatedSender = await this.updateUserScore({
      user: sender,
      scoreEarned: -scoreRules.reaction.send
    })

    const receiver = await User.findOne({
      [`${name}.username`]: user.username
    })
    const updatedReceiver = await this.updateUserScore({
      user: receiver,
      scoreEarned: -scoreRules.reaction.receive
    })

    const reactionsOnMessage = await Reaction.find({
      'provider.messageId': reaction.provider.messageId,
      user: reaction.user
    })

    if (!reactionsOnMessage[0]) return

    this.scoreReactionSended({
      sender: updatedSender,
      reaction: reactionsOnMessage[0],
      payload,
      alreadyAchieved: true
    })

    this.scoreReactionReceived({
      receiver: updatedReceiver,
      reaction: reactionsOnMessage[0],
      payload,
      alreadyAchieved: true
    })
  }
}

export default new ScoreController()
