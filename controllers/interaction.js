import config from "config-yml";
import mongoose from "mongoose";
import moment from "moment";
import userController from "./user";

import { calculateScore } from "../utils";
import { lastMessageTime } from "../utils/interactions";
import { _throw, _today } from "../helpers";

const normalize = data => {
  if (data.type === "reaction_added" || data.type === "reaction_removed") {
    return {
      channel: data.item.channel,
      date: new Date(),
      description: data.reaction,
      messageIdentifier: data.event_ts,
      parentMessage: data.item.ts,
      parentUser: data.item_user,
      thread: false,
      type: data.type,
      user: data.user
    };
  } else if (data.thread_ts) {
    return {
      channel: data.channel,
      date: new Date(),
      description: data.text,
      messageIdentifier: data.ts,
      parentMessage: data.event_ts,
      parentUser: data.parent_user_id,
      thread: true,
      type: "thread",
      user: data.user
    };
  } else {
    return {
      channel: data.channel,
      date: new Date(),
      description: data.text,
      messageIdentifier: data.ts,
      parentMessage: null,
      thread: false,
      type: "message",
      user: data.user
    };
  }
};

export const save = async data => {
  const InteractionModel = mongoose.model("Interaction");
  const interaction = normalize(data);
  const todayLimitScore = config.xprules.limits.daily;
  const score = await todayScore(interaction.user);
  const todayLimitStatus = todayLimitScore - score;
  const instance = new InteractionModel(interaction);
  const response = instance.save();

  if (
    interaction.type === "message" &&
    moment(interaction.date).diff(
      await lastMessageTime(interaction.user),
      "seconds"
    ) < 5
  ) {
    return _throw("User makes flood");
  }

  if (todayLimitStatus > 0) {
    userController.update(interaction);
    interaction.type !== "message" &&
      interaction.parentUser !== interaction.user &&
      userController.updateParentUser(interaction);
  }

  return response || _throw("Error adding new interaction");
};

export const find = async user => {
  const InteractionModel = mongoose.model("Interaction");
  const result = await InteractionModel.find({
    $or: [{ user: user }, { parentUser: user }]
  })
    .sort({
      date: -1
    })
    .exec();

  return result || _throw("Error finding interactions");
};

export const todayScore = async user => {
  let score = 0;
  const InteractionModel = mongoose.model("Interaction");
  const result = await InteractionModel.find({
    user: user,
    date: {
      $gte: _today.start
    }
  }).exec();

  result.map(item => {
    score = score + calculateScore(item);
  });

  return +score;
};

export const remove = async data => {
  const InteractionModel = mongoose.model("Interaction");
  const interaction = normalize(data);
  const reactionAdded = await InteractionModel.findOne({
    description: interaction.description,
    parentMessage: interaction.parentMessage
  }).exec();

  if (reactionAdded) {
    const result = await InteractionModel.deleteOne({
      description: interaction.description,
      parentMessage: interaction.parentMessage
    });
    userController.update(interaction);

    interaction.parentUser !== interaction.user &&
      userController.updateParentUser(interaction);

    return result || _throw("Error removing interactions");
  }

  return _throw("Error removing interactions");
};

export const lastMessage = async user => {
  const InteractionModel = mongoose.model("Interaction");
  const result = await InteractionModel.find({
    user: user,
    type: "message"
  })
    .sort({
      date: -1
    })
    .limit(1)
    .exec();

  return result || _throw("Error finding last interaction by user");
};

export default {
  find,
  remove,
  save,
  todayScore,
  lastMessage
};
