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
    try {
      const { name, user } = payload.provider

      const sender = await User.findOne({
        [`${name}.username`]: reaction.provider.username
      })
      if (sender)
        this.scoreReactionSended({ sender, reaction, payload, alreadyAchieved })

      const receiver = await User.findOne({
        [`${name}.username`]: user.username
      })
      if (receiver)
        this.scoreReactionReceived({
          receiver,
          reaction,
          payload,
          alreadyAchieved
        })
    } catch (error) {
      LogController.sendError(error)
    }
  }

  async scoreReactionSended(data) {
    try {
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

      const cannotAchieve = await this.reactionSendedCannotAchieve({ reaction })
      if (alreadyAchieved || cannotAchieve) return

      AchievementController.handle({
        user: updatedSender,
        achievementType: achievementTypes.reactionSended,
        provider: reaction.provider.name
      })
    } catch (error) {
      LogController.sendError(error)
    }
  }

  async scoreReactionReceived(data) {
    try {
      const { receiver, reaction, payload, alreadyAchieved } = data

      if (
        await this.reactionReceivedCannotScore({ receiver, reaction, payload })
      )
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

      const cannotAchieve = await this.reactionReceiveCannotAchieve({
        uuid: updatedReceiver.uuid,
        reaction
      })

      if (alreadyAchieved || cannotAchieve) return
      AchievementController.handle({
        user: updatedReceiver,
        achievementType: achievementTypes.reactionReceived,
        provider: reaction.provider.name
      })
    } catch (error) {
      LogController.sendError(error)
    }
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

  async handleExternalInteraction(payload) {
    try {
      const { scoreType, achievementType, queries, details } = payload

      const user = await User.findOne(queries.user)
      if (!user) return

      const lastScore = await Score.findOne({
        user: user.uuid,
        description: scoreType,
        ...queries.details
      }).sort({ 'details.occurredAt': -1 })

      if (lastScore) {
        const lastInteraction = moment(lastScore.details.occurredAt)

        const pastHours = moment
          .duration(moment(details.occurredAt).diff(lastInteraction))
          .asHours()

        if (pastHours < scoreRules[scoreType].limit)
          return await AchievementController.handle({
            user,
            achievementType,
            provider: details.provider
          })
      }

      const score = scoreRules[scoreType].score

      await Score.create({
        user: user.uuid,
        score,
        description: scoreType,
        details
      })

      const updatedUser = await this.updateUserScore({
        user,
        scoreEarned: score
      })

      await AchievementController.handle({
        user: updatedUser,
        achievementType,
        provider: details.provider
      })
    } catch (error) {
      LogController.sendError({
        file: 'ScoreController.handleEmailEvent',
        resume: error.toString(),
        details: { error, payload }
      })
    }
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
    try {
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

      if (!reactionsOnMessage[0])
        return this.scoreReactionRemoved({ sender, receiver, reaction })

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
    } catch (error) {
      LogController.sendError(error)
    }
  }

  async scoreReactionRemoved({ sender, receiver, reaction }) {
    try {
      const options = {
        runValidators: true,
        upsert: true,
        setDefaultsOnInsert: true,
        new: true
      }

      const receiverPayload = {
        user: receiver.uuid,
        score: 0,
        description: scoreTypes.reactionRemoved,
        details: {
          provider: reaction.provider.name,
          messageId: reaction.provider.messageId,

          sender: reaction.user
        }
      }

      const senderPayload = {
        user: sender.uuid,
        score: 0,
        description: scoreTypes.reactionRemoved,
        details: {
          provider: reaction.provider.name,
          messageId: reaction.provider.messageId
        }
      }

      await Score.findOneAndUpdate(senderPayload, senderPayload, options)
      await Score.findOneAndUpdate(receiverPayload, receiverPayload, options)
    } catch (error) {
      LogController.sendError(error)
    }
  }
}

export default new ScoreController()
