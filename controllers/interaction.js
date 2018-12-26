import config from "config-yml";
import mongoose from "mongoose";
import moment from "moment";
import userController from "./user";
import achievementController from "./achievement";

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
      user: data.user,
      category: config.categories.network.type,
      action: config.actions.reaction.type
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
      user: data.user,
      category: config.categories.network.type,
      action: config.actions.thread.type
    };
  } else if (data.type === "manual") {
    return {
      type: data.type,
      user: data.user,
      value: data.value,
      thread: false,
      description: data.text,
      channel: "mundão",
      category: config.categories.network.type,
      action: "manual"
    };
  } else if (data.type === "inactivity") {
    return {
      type: data.type,
      user: data.user,
      thread: false,
      description: "ação do sistema",
      channel: "matrix",
      category: config.categories.network.type,
      action: "inactivity"
    };
  } else if (data.type === "issue") {
    return {
      type: data.type,
      user: data.user,
      thread: false,
      description: "new github issue",
      channel: data.repository.id
    };
  } else if (data.type === "review") {
    return {
      type: data.type,
      user: data.user,
      thread: false,
      description: "review",
      channel: data.review.id
    };
  } else if (data.type === "pull_request") {
    return {
      type: data.type,
      user: data.user,
      thread: false,
      description: "review",
      channel: data.pull_request.id
    };
  } else if (data.type === "merged_pull_request") {
    return {
      type: data.type,
      user: data.user,
      thread: false,
      description: "merged pull request",
      channel: data.pull_request.id
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
      user: data.user,
      category: config.categories.network.type,
      action: config.actions.message.type
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

  if (todayLimitStatus > 0 || !todayLimitStatus) {
    userController.update(interaction);
    achievementController.save(interaction);
    if (
      ![
        "message",
        "issue",
        "review",
        "pull_request",
        "merged_pull_request"
      ].includes(
        interaction.type
      ) &&
      interaction.parentUser !== interaction.user
    ) {
      userController.updateParentUser(interaction);
    }
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

const manualInteractions = async data => {
  const InteractionModel = mongoose.model("Interaction");
  const interaction = normalize(data);
  const instance = new InteractionModel(interaction);
  const score = await todayScore(interaction.user);
  const todayLimitStatus = config.xprules.limits.daily - score;

  if (todayLimitStatus > 0) {
    const response = await instance.save();
    userController.update(interaction);

    return response || _throw("Error adding new manual interaction");
  }
};

export default {
  find,
  remove,
  save,
  todayScore,
  lastMessage,
  manualInteractions
};
