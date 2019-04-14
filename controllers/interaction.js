import config from "config-yml";
import mongoose from "mongoose";
import moment from "moment";
import batch from "batchflow";
import userController from "./user";
import rocketController from "./rocket";
import achievementController from "./achievement";
import achievementTemporaryController from "./achievementTemporary";
import { calculateScore, analyticsSendCollect } from "../utils";
import { lastMessageTime } from "../utils/interactions";
import { _throw, _today } from "../helpers";
import { isBot } from "../utils/bot";
import { fromPrivateChannel } from "../utils/rocket";
import interactionModel from "../models/interaction";
import api from "../rocket/api";
import log4js from "log4js";
import minerController from "./miner";
import { isValidToken } from "../utils/teams";

/**
 * Some ideias to refactor normalize function:
 *
 * identify origin and get by type
 *
 */
let normalize = data => {
  if (data.type === "manual") {
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
      action: config.actions.github.type,
      score: config.xprules.github.issue
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
      action: config.actions.github.type,
      score: config.xprules.github.review
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
      action: config.actions.github.type,
      score: config.xprules.github.pull_request
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
      action: config.actions.github.type,
      score: config.xprules.github.merged_pull_request
    };
  } else if (data.origin === "rocket") {
    // TODO: Remove
    if (data.reactions) {
      return {
        origin: data.origin,
        channel: data.roomName,
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
        channel: data.roomName,
        date: new Date(),
        description: fromPrivateChannel(data) ? "" : data.msg,
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
  } else if (data.type == "article") {
    return {
      origin: "blog",
      channel: data.channel,
      date: new Date(),
      description: data.text,
      messageIdentifier: data.ts,
      parentMessage: null,
      thread: false,
      type: "message",
      user: data.user,
      category: config.categories.network.type,
      action: config.actions.blog.type
    };
  }
};

const flood = async data => {
  return exportFunctions
    .lastMessage(data.u._id)
    .then(msg => {
      let lastDate = 0;
      if (msg) {
        lastDate = msg.date;
      }
      const maxSeconds = 5;
      const type = rocketController.type(data);
      if (
        type === "message" &&
        moment(data.date).diff(lastDate, "seconds") < maxSeconds
      ) {
        return Promise.reject("usuario fez flood");
      } else {
        return Promise.resolve(true);
      }
    })
    .catch(err => {
      return Promise.reject(err);
    });
};

const validInteraction = async data => {
  let user;
  return userController
    .valid(data)
    .then(res => {
      user = res;
      return flood(data);
    })
    .then(() => {
      return user;
    })
    .catch(err => {
      return new Promise.reject(err);
    });
};

export const save = async data => {
  if (isBot(data)) {
    return;
  }
  let valid = true;
  let interaction;
  let user;
  // apply valid function to others integrations
  if (data.origin === "rocket") {
    user = await exportFunctions
      .validInteraction(data)
      .then(res => {
        if (res) {
          interaction = rocketController.normalize(data);
        }
        return res;
      })
      .catch(() => {
        valid = false;
      });
  } else {
    interaction = exportFunctions.normalize(data);
  }

  if (valid && interaction.type !== "reaction_added") {
    const todayScore = await exportFunctions.todayScore(interaction.user);
    const todayLimiteScore = config.xprules.limits.daily;
    const todayLimitStatus = todayLimiteScore - todayScore;
    const instance = interactionModel(interaction);
    if (todayLimitStatus > 0 || !todayLimitStatus) {
      await userController.customUpdate(
        user.rocketId,
        interaction.score,
        interaction
      );
      await achievementController.save(interaction, user);
      await achievementTemporaryController.save(interaction);
    } else {
      instance.score = 0;
    }
    analyticsSendCollect(interaction);
    return instance.save();
  } else {
    return new Promise((resolve, reject) => {
      reject("add new interaction");
    });
  }
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
  return interactionModel
    .find({
      user: user,
      date: {
        $gte: _today.start
      }
    })
    .then(interactions => {
      const total = interactions.reduce(
        (prevVal, interaction) => prevVal + interaction.score,
        0
      );
      return Promise.resolve(total);
    })
    .catch(() => {
      return Promise.reject(0);
    });
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

const lastMessage = async userId => {
  return interactionModel.findOne({ user: userId, type: "message" }, "date", {
    sort: { _id: -1 }
  });
};

const manualInteractions = async data => {
  const InteractionModel = mongoose.model("Interaction");
  const interaction = exportFunctions.normalize(data);
  const instance = new InteractionModel(interaction);
  const score = await exportFunctions.todayScore(interaction.user);
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
  // pegar o user
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
    return scoreDay;
  }
};

const dayScore = async interaction => {
  const date = new Date(interaction.date);
  const start = date.setHours(0, 0, 0, 0);
  const end = date.setHours(23, 59, 59, 999);
  return interactionModel
    .find({
      user: interaction.user,
      date: {
        $gte: start,
        $lt: end
      }
    })
    .then(interactions => {
      const total = interactions.reduce(
        (prevVal, interaction) => prevVal + calculateScore(interaction),
        0
      );
      return Promise.resolve(total);
    })
    .catch(() => {
      return Promise.reject(0);
    });
};

const normalizeScore = async (req, res) => {
  const interactions = await findAll();
  batch(interactions)
    .sequential()
    .each(async (i, item, done) => {
      const data = item;
      data.origin = "slack";
      calculate(data).then(res => {
        if (res) {
          item.score = res;
          item.save();
        }
      });
      done();
    })
    .end(results => {
      console.log("results ", results);
    });
  res.send("Interações normalizadas");
};

const aggregateBy = async args => {
  const result = await interactionModel.aggregate(args).exec();
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

const mostActives = async (beginDate, endDate) => {
  return await aggregateBy([
    {
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "rocketId",
        as: "userObject"
      }
    },
    {
      $unwind: "$userObject"
    },
    {
      $match: {
        date: { $gte: beginDate, $lte: endDate },
        score: { $gt: 0 }
      }
    },
    {
      $group: {
        _id: {
          _id: "$userObject._id",
          name: "$userObject.name",
          rocketId: "$userObject.rocketId",
          username: "$userObject.username"
        },
        count: { $sum: 1 },
        date: { $first: "$date" }
      }
    },
    {
      $match: {
        count: { $gte: 6 }
      }
    },
    {
      $sort: { count: -1 }
    }
  ]);
};

const history = async (req, res) => {
  const logger = log4js.getLogger("history");
  const channels = await api.getChannels();
  console.log(channels);
  for (let channel of channels) {
    console.log("======= CHANNEL", channel._id);
    const messages = await api.getHistory(channel._id);
    // const messages = await api.getHistory("Aa6fSXib23WpHjof7");
    batch(messages.reverse())
      .sequential()
      .each(async (i, item, done) => {
        item.origin = "rocket";
        item.history = true;
        if (!item.t) {
          console.log("MSG", i);
          exportFunctions.save(item).catch(err => {
            console.log(
              "Erro ao salvar interação do usuário: id: ",
              item.u._id,
              " name: ",
              item.u.name,
              " em: ",
              item.ts,
              " ===> ",
              err
            );
            logger.error(item, err);
          });
        }
        done();
      })
      .end(() => {
        console.log("finish");
      });
    console.log(
      "quantidade de mensagens ",
      messages.length,
      " para o channel: ",
      channel._id
    );
  }
  res.json("success");
};

const validDate = date => {
  return moment(date, "DD-MM-YYYY", true).isValid();
};

const validInterval = (begin, end) => {
  const momentBegin = moment(begin, "DD-MM-YYYY", true);
  const momentEnd = moment(end, "DD-MM-YYYY", true);
  return momentEnd.diff(momentBegin) >= 0;
};

const engaged = async (req, res) => {
  const { team, token, begin, end } = req.headers;
  const isMiner = await minerController.isMiner(req, res);
  let response = {
    text: "",
    attachments: []
  };
  const rocketId = req.body.id;
  const beginDate = isMiner ? begin : req.body.begin;
  const endDate = isMiner ? end : req.body.end;
  const isCoreTeam = await userController.isCoreTeam({ rocketId: rocketId });
  const validDates =
    exportFunctions.validDate(beginDate) && exportFunctions.validDate(endDate);
  const validIntervals = validInterval(beginDate, endDate);
  const validFunctions = validDates && validIntervals;
  if ((isCoreTeam && validFunctions) || (isMiner && validFunctions)) {
    const users = await exportFunctions.mostActives(
      moment(beginDate, "DD-MM-YYYY")
        .startOf("day")
        .toDate(),
      moment(endDate, "DD-MM-YYYY")
        .endOf("day")
        .toDate()
    );
    response.text = `Total de ${users.length} usuário engajados`;
    users.forEach(user => {
      response.attachments.push({
        text: `Username: @${user._id.username} | Name: ${
          user._id.name
        } | Qtd. interações: ${user.count}`
      });
    });
  } else if (isCoreTeam && validDates && !validIntervals) {
    response.text = "Data de ínicio não pode ser maior que data final";
  } else if (!validDates && isCoreTeam) {
    response.text =
      "Datas em formatos inválidos por favor use datas com o formato ex: 10-10-2019";
  } else {
    response.text =
      "Você não tem uma armadura de ouro, e não pode entrar nessa casa!";
  }

  if (isMiner && !isValidToken(team, token)) {
    response.text = "Invalid Token";
    response.attachments = [];
  }

  res.json(response);
};

const exportFunctions = {
  findBy,
  find,
  remove,
  save,
  dayScore,
  todayScore,
  lastMessage,
  manualInteractions,
  normalizeScore,
  normalize,
  byDate,
  history,
  validInteraction,
  flood,
  mostActives,
  engaged,
  validDate,
  validInterval
};

export default exportFunctions;
