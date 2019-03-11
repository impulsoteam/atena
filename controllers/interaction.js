import config from "config-yml";
import mongoose from "mongoose";
import moment from "moment";
import userController from "./user";
import achievementController from "./achievement";
import achievementTemporaryController from "./achievementTemporary";
import { calculateScore, analyticsSendCollect } from "../utils";
import { lastMessageTime, getAction, getOrigin } from "../utils/interactions";
import { _throw, _today } from "../helpers";
import { getUserFromReaction } from "../utils/reactions";

let normalize = data => {
  if (data.type === "reaction_added" || data.type === "reaction_removed") {
    return {
      origin: "slack",
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
      origin: "slack",
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
      origin: "sistema",
      type: data.type,
      user: data.user,
      rocketUsername: data.user,
      value: data.value,
      thread: false,
      description: data.text,
      channel: "mundão",
      category: config.categories.network.type,
      action: "manual"
    };
  } else if (data.type === "inactivity") {
    return {
      origin: "sistema",
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
      origin: "github",
      type: data.type,
      user: data.user,
      thread: false,
      description: "new github issue",
      channel: data.repository.id,
      category: config.categories.network.type,
      action: config.actions.github.type
    };
  } else if (data.type === "review") {
    return {
      origin: "github",
      type: data.type,
      user: data.user,
      thread: false,
      description: "review",
      channel: data.review.id,
      category: config.categories.network.type,
      action: config.actions.github.type
    };
  } else if (data.type === "pull_request") {
    return {
      origin: "github",
      type: data.type,
      user: data.user,
      thread: false,
      description: "review",
      channel: data.pull_request.id,
      category: config.categories.network.type,
      action: config.actions.github.type
    };
  } else if (data.type === "merged_pull_request") {
    return {
      origin: "github",
      type: data.type,
      user: data.user,
      thread: false,
      description: "merged pull request",
      channel: data.pull_request.id,
      category: config.categories.network.type,
      action: config.actions.github.type
    };
  } else if (data.origin === "rocket") {
    if (data.reactions) {
      return {
        origin: "rocket",
        channel: data.rid,
        date: new Date(),
        description: Object.keys(data.reactions).pop(),
        parentUser: data.u._id,
        user: null,
        type: "reaction_added",
        category: config.categories.network.type,
        action: config.actions.reaction.type
      };
    } else {
      return {
        origin: data.origin,
        channel: data.rid,
        date: new Date(),
        description: data.msg,
        type: "message",
        user: data.u._id,
        username: data.u.name,
        rocketUsername: data.u.username,
        category: config.categories.network.type,
        action: config.actions.message.type
      };
    }
  } else if (data.type == "comment") {
    return {
      origin: "blog",
      type: data.type,
      user: data.user,
      thread: false,
      description: "comment on blog",
      channel: data.id,
      category: config.categories.network.type,
      action: config.actions.blog.type
    };
  } else {
    return {
      origin: getOrigin(data),
      channel: data.channel,
      date: new Date(),
      description: data.text,
      messageIdentifier: data.ts,
      parentMessage: null,
      thread: false,
      type: "message",
      user: data.user,
      category: config.categories.network.type,
      action: getAction(data)
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

  analyticsSendCollect(interaction);

  if (
    interaction.type === "message" &&
    moment(interaction.date).diff(await lastMessageTime(instance), "seconds") <
      5
  ) {
    return _throw("User makes flood");
  }

  if (
    interaction.type === "reaction_added" &&
    interaction.origin === "rocket"
  ) {
    const user = await getUserFromReaction(data);

    interaction.user = user ? user.id : null;
    interaction.rocketUsername = user ? user.username : null;
    interaction.username = user ? user.name : null;
  }

  if (todayLimitStatus > 0 || !todayLimitStatus) {
    instance.score = calculateScore(interaction);
    await userController.update(interaction);
    await achievementController.save(interaction);
    await achievementTemporaryController.save(interaction);

    if (
      ![
        "message",
        "issue",
        "review",
        "pull_request",
        "merged_pull_request",
        "comment"
      ].includes(interaction.type) &&
      interaction.parentUser !== interaction.user
    ) {
      await userController.updateParentUser(interaction);
    }
  }
  const response = instance.save();
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

export const lastMessage = async interaction => {
  const InteractionModel = mongoose.model("Interaction");
  const result = await InteractionModel.find({
    user: interaction.user,
    type: "message",
    _id: { $lt: interaction.id }
  })
    .sort({
      _id: -1
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

const findAll = async () => {
  const InterActionModel = mongoose.model("Interaction");
  const result = await InterActionModel.find()
    .sort()
    .exec();
  return result;
};

const findBy = async args => {
  const InterActionModel = mongoose.model("Interaction");
  const result = await InterActionModel.find(args).exec();
  return result || null;
};

const calculate = async interaction => {
  const todayLimitScore = config.xprules.limits.daily;
  const scoreDay = await dayScore(interaction);
  const todayLimitStatus = todayLimitScore - scoreDay;
  if (
    interaction.type === "message" &&
    moment(interaction.date).diff(
      await lastMessageTime(interaction),
      "seconds"
    ) < 5
  ) {
    return _throw("User makes flood");
  }
  if (todayLimitStatus > 0 || !todayLimitStatus) {
    return await calculateScore(interaction);
  }
};

const dayScore = async interaction => {
  const date = new Date(interaction.date);
  let score = 0;
  const InteractionModel = mongoose.model("Interaction");
  const start = date.setHours(0, 0, 0, 0);
  const end = date.setHours(23, 59, 59, 999);
  const result = await InteractionModel.find({
    user: interaction.user,
    date: {
      $gte: start,
      $lt: end
    }
  }).exec();

  result.map(item => {
    score = score + calculateScore(item);
  });
  return +score;
};

const normalizeScore = async (req, res) => {
  const interactions = await findAll();
  await interactions.map(async interaction => {
    const score = await calculate(interaction);
    interaction.score = score;
    interaction.save();
  });
  res.send("Interações normalizadas");
};

const aggregateBy = async args => {
  const InterActionModel = mongoose.model("Interaction");
  const result = await InterActionModel.aggregate(args).exec();
  return result || null;
};

const byDate = async (year, month) => {
  return await aggregateBy([
    {
      $match: {
        date: { $gte: new Date(year, month), $lt: new Date(year, month + 1) },
        score: { $gte: 0 }
      }
    },
    {
      $group: {
        _id: { user: "$user" },
        totalScore: { $sum: "$score" }
      }
    },
    {
      $sort: { totalScore: -1 }
    }
  ]);
};

export default {
  findBy,
  find,
  remove,
  save,
  todayScore,
  lastMessage,
  manualInteractions,
  normalizeScore,
  byDate
};
