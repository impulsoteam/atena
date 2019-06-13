import config from "config-yml";
import { driver } from "@rocket.chat/sdk";
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
import interactionModel from "../models/interaction";
import channelCheckPointModel from "../models/channelCheckPoint";
import checkPointModel from "../models/checkpoint";
import api from "../rocket/api";
import log4js from "log4js";
import minerController from "./miner";
import blogController from "./blog";
import githubController from "./github";
import { isValidToken } from "../utils/teams";

moment.locale("pt-br");

const normalize = data => {
  if (data.type === "manual") {
    return {
      origin: "sistema",
      type: data.type,
      user: data.user,
      rocketUsername: data.username,
      value: data.value,
      thread: false,
      description: data.text,
      channel: "mundão",
      category: config.categories.network.type,
      action: "manual",
      score: data.score || 0
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
  } else if (data.origin === "rocket") {
    return rocketController.normalize(data);
  } else if (data.origin === "blog") {
    return blogController.normalize(data);
  } else if (data.origin === "github") {
    return githubController.normalize(data);
  }
};

const flood = async data => {
  return exportFunctions
    .lastMessage(data.user)
    .then(msg => {
      let lastDate = 0;
      if (msg) {
        lastDate = msg.date;
      }
      const maxSeconds = config.xprules.limits.flood;
      const isFlood =
        data.type === "message" &&
        moment(data.date).diff(lastDate, "seconds") < maxSeconds;
      return Promise.resolve(isFlood);
    })
    .catch(err => {
      return Promise.reject(err);
    });
};

export const save = async data => {
  if (isBot(data)) return;

  const interaction = exportFunctions.normalize(data);
  if (interaction.type !== "reaction_added") {
    const user = await userController.getUserByRocket(interaction.user);
    if (user) {
      if (user.score === 0)
        await userController.sendWelcomeMessage(user.username);

      const instance = interactionModel(interaction);
      const isInLimit = await isOnDailyLimit(interaction);
      const isFlood = await flood(interaction);

      if (isInLimit && !isFlood) {
        await userController.updateScore(user, interaction.score);
        await achievementController.save(interaction, user);
        await achievementTemporaryController.save(interaction);
      } else {
        instance.score = 0;
      }

      analyticsSendCollect(interaction);
      return instance.save();
    }

    return Promise.reject("Error on save interaction");
  }
};

export const isOnDailyLimit = async interaction => {
  const todayScore = await exportFunctions.todayScore(interaction.user);
  const todayLimitScore = config.xprules.limits.daily;
  const todayLimitStatus = todayLimitScore - todayScore;
  return todayLimitStatus > 0 || !todayLimitStatus;
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

const byChannel = async (beginDate, endDate, channelId) => {
  return await aggregateBy([
    {
      $match: {
        date: { $gte: beginDate, $lte: endDate },
        score: { $gte: 0 },
        channel: { $eq: channelId }
      }
    }
  ]);
};

const mostActives = async (
  beginDate,
  endDate,
  channel = false,
  minCount = 6
) => {
  let queryMatch = {
    date: { $gte: beginDate, $lte: endDate },
    score: { $gte: 0 }
  };

  if (channel) {
    queryMatch = {
      ...queryMatch,
      channel: { $eq: channel }
    };
  }

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
      $match: queryMatch
    },
    {
      $group: {
        _id: {
          _id: "$userObject._id",
          name: "$userObject.name",
          rocketId: "$userObject.rocketId",
          username: "$userObject.username",
          channel: "$channel"
        },
        count: { $sum: 1 },
        date: { $first: "$date" }
      }
    },
    {
      $match: {
        count: { $gte: minCount }
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
  let team, token, begin, end;
  const isMiner = await minerController.isMiner(req, res);
  if (isMiner) {
    team = req.headers.team;
    token = req.headers.token;
    begin = req.headers.begin;
    end = req.headers.end;
  }
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
      let usernameText = null;
      let nameText = null;
      let rocketIdText = null;
      if (user._id.username) {
        usernameText = `Username: @${user._id.username} |`;
      }
      if (user._id.name) {
        nameText = `Name: ${user._id.name} |`;
      }
      if (user._id.rocketId) {
        rocketIdText = `Rocket ID: ${user._id.rocketId} |`;
      }
      response.attachments.push({
        text: `${usernameText} ${nameText} ${rocketIdText} Qtd. interações: ${
          user.count
        }`
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

const checkpoints = async (type = "week") => {
  // quarterly
  const channels = (await api.getChannels()) || [];
  const today = moment();
  const beginQuarter = moment()
    .quarter(moment().quarter())
    .startOf("quarter");
  const endQuarter = moment()
    .quarter(moment().quarter())
    .endOf("quarter");
  if (type === "week") {
    if (today.weekday() === 1) {
      const lastMonday = today.clone().subtract(7, "days");
      const lastSunday = today.clone().subtract(1, "day");
      channels.map(async channel => {
        const users = await exportFunctions.mostActives(
          lastMonday.startOf("day").toDate(),
          lastSunday.endOf("day").toDate(),
          channel._id
        );

        if (users.length > 0) {
          await channelCheckPointModel.findOneAndUpdate(
            {
              beginDate: beginQuarter
            },
            {
              $set: {
                beginDate: beginQuarter,
                endDate: endQuarter,
                engagedUsers: users,
                channel: channel._id
              }
            },
            { upsert: true, setDefaultsOnInsert: true }
          );
        }
      });
    } else {
      return Promise.reject(
        "O checkpoint por semana deve ser feito em uma segunda feira"
      );
    }
  } else {
    if (today.isSame(beginQuarter)) {
      // close before quarter
      const beforeQuarter = today.clone().subtract(1, "quarter");
      const beginBeforeQuarter = moment()
        .quarter(beforeQuarter.quarter())
        .startOf("quarter");

      const endBeforeQuarter = moment()
        .quarter(beforeQuarter.quarter())
        .startOf("quarter");

      channels.forEach(async channel => {
        const { _id, name } = channel;
        // total de interacoes validas do trimeste
        const quarterInteractions = await exportFunctions.byChannel(
          beginBeforeQuarter,
          endBeforeQuarter,
          _id
        );

        const channelCheckPoint = await channelCheckPointModel.findOne({
          channelId: _id,
          beginDate: { $eq: beginBeforeQuarter }
        });

        const checkpoint = await checkPointModel.findOne({
          totalEngagedUsers: { $gte: channelCheckPoint.engagedUsers.length },
          xp: { $gte: quarterInteractions.length }
        });

        channelCheckPoint.totalInteractions = quarterInteractions.length;
        channelCheckPoint.channel = _id;
        if (checkpoint) {
          channelCheckPoint.level = checkpoint.level;
          channelCheckPoint.status = "winner";
          channelCheckPoint.minEngagedUsers = checkpoint.totalEngagedUsers;
          channelCheckPoint.qtdInteractions = checkpoint.xp;
          let msg = "";
          if (checkpoint.level === "bronze") {
            msg = `Residentes de #${name}], hoje chamaram a atenção da tua deusa por todo teu trabalho em conjunto e crescimento! Por isso, a partir de agora recebem o status de Povoado! <br>
              E como forma de comemorar este feito vocês receberão uma recompensa a altura!`;
          } else if (checkpoint.level === "prata") {
            msg = `
							Povoado de #${name}, muito me alegra ver o quão rápido continuam a crescer e desta forma a alcunha de Povoado precisa ser revogado! A partir de hoje, passam ao status de Aldeia!<br>
							E para de comemorar tal feito receberão uma recompensa!<Paste>
            `;
          } else if (checkpoint.level === "ouro") {
            msg = `Aldeia de #${name}, vejo o quanto vocês cresceram e que muitos são os que povoam estas terras, desta forma teu status de Aldeia não faz mais juz a teu tamanho! A partir de hoje, passam ao status de Vila!<br>
            E isto merece uma comemoração! Esta é a recompensa que merecem por sua ascenção!`;
          } else if (checkpoint.level === "platina") {
            msg = `Vila de #${name}! Não param de me impressionar! Entre os muitos de meu reino vocês alcançaram uma proporção digna de destaque! A partir de hoje, passam ao status de Cidade!
              <br>Hoje é dia de festa e toda ela merece uma recompensa!"`;
          } else if (checkpoint.level === "diamante") {
            msg = `Cidade de #${name}! Jamais imaginei que chegariam tão longe, tão grande é tua extensão e tantos são os teus que não consigo estimar! Por alcançar tamanha notoriedade a partir de hoje, o status de apena Cidade não é o bastante para ti! E passam ao status de Cidade-Estado!<br>
Por alcançarem tamanho feito irei conferir a recompensa máxima que um dos meus reinos pode receber!`;
          }
          let response = {
            text: msg,
            attachments: []
          };

          response.attachments.push({
            text: `Recompensas`
          });
          checkpoint.rewards.forEach(item => {
            response.attachments.push({ text: item });
          });
          driver.sendToRoomId(response, _id);
        } else {
          channelCheckPoint.status = "loser";
        }
      });
    }
  }
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
  flood,
  mostActives,
  engaged,
  validDate,
  validInterval,
  checkpoints,
  byChannel
};

export default exportFunctions;
