import mongoose from "mongoose";
import { driver } from "@rocket.chat/sdk";
import userController from "./user";
import interactionController from "./interaction";
import { calculateLevel } from "../utils";
import axios from "axios";
import { renderScreen } from "../utils/ssr";

const myPosition = async (user_id, users) => {
  const user = await userController.getNetwork(user_id);
  const id = user.network === "rocket" ? user.rocketId : user.slackId;
  return users.map(e => e.user).indexOf(id) + 1;
};

const rocket_info = async user_id => {
  const url = `https://${process.env.ROCKET_HOST}/api/v1/users.info`;

  return axios.get(url, {
    params: {
      userId: user_id
    },
    headers: {
      "X-Auth-Token": process.env.ROCKET_USER_TOKEN,
      "X-User-Id": process.env.ROCKET_USER_ID
    }
  });
};

const bot_index = async (req, res) => {
  let response = {
    text: "Veja as primeiras pessoas do ranking:",
    attachments: []
  };
  let user_id;
  let month;
  const limit_ranking = 5;

  if (req.headers.origin === "rocket") {
    user_id = req.body.id;
    req.body.user_id = user_id;
    month = req.body.month;
  } else {
    user_id = req.body.user_id;
    month = req.body.text;
  }

  let allUsers = await userController.findAll(false, 0);
  let usersFromApi = [];
  for (let user of allUsers) {
    let name;
    let network;
    if (user.rocketId) {
      let response = await rocket_info(user.rocketId);
      name = response.data.user.name;
      network = "rocket";
    } else {
      name = user.name;
      network = "slack";
    }
    usersFromApi.push({
      name: name,
      user_id: user.rocketId ? user.rocketId : user.slackId,
      network: network
    });
  }
  const rankingMonthly = await monthly(month);
  if (rankingMonthly.text) {
    response = rankingMonthly;
  } else if (!rankingMonthly.text && rankingMonthly.users.length === 0) {
    response = { text: "Ops! Ainda ninguém pontuou. =/" };
  } else {
    const limit_users = rankingMonthly.users.slice(0, limit_ranking);
    response.attachments = await limit_users.map((user, index) => ({
      text: `${index + 1}º lugar está ${
        usersFromApi.find(u => u.user_id === user.user).name
      } com ${user.score} XP, no nível ${user.level}`
    }));

    let msg_user;
    const position = await myPosition(user_id, rankingMonthly.users);
    if (position > 0) {
      msg_user = `Ah, e você está na posição ${position} do ranking`;
    } else {
      msg_user = `Opa, você não pontuou no game nesse mês`;
    }
    response.attachments.push({ text: msg_user });
  }

  res.json(response);
};

const valid_month = async month => {
  const re = /(^0?[1-9]$)|(^1[0-2]$)/;
  return re.test(month);
};

const monthNames = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro"
];

const monthly = async month => {
  const today = new Date(Date.now());
  let query_date = new Date(today.getFullYear(), today.getMonth());
  let query_month = today.getMonth();
  if (month) {
    if (!(await valid_month(month)))
      return { text: "Digite um mês válido Ex: /ranking 1" };
    query_month = month - 1;
    query_date = new Date(today.getFullYear(), query_month);
  }
  const ranking = await findBy({
    date: {
      $gte: query_date
    }
  });
  if (!ranking)
    return {
      text: `Ranking do mês de ${
        monthNames[query_month]
      } não gerado ou encontrado`
    };

  return ranking;
};

const findBy = async args => {
  const RankingModel = mongoose.model("Ranking");
  const result = await RankingModel.findOne(args).exec();
  return result || null;
};

const findAll = async (isCoreTeam = false, month = Date.now, limit = 20) => {
  const RankingModel = mongoose.model("Ranking");
  const result = await RankingModel.find({
    isCoreTeam: isCoreTeam,
    date: month
  })
    .sort({
      score: -1
    })
    .limit(limit)
    .exec();
  return result || [];
};

const closeRanking = async date => {
  const RankingModel = mongoose.model("Ranking");
  let year = date.getFullYear();
  let month = date.getMonth();
  if (month == 0) {
    year -= 1;
    month = 12;
  }
  const ranking = await RankingModel.findOne({
    date: {
      $gte: new Date(year, --month)
    }
  }).exec();
  if (ranking) {
    ranking.closed = true;
    ranking.save();
  }
};

const save = async (isCoreTeam = false, today = new Date(Date.now())) => {
  const interactions = await interactionController.byDate(
    today.getFullYear(),
    today.getMonth()
  );

  const ranking_users = interactions.map(interaction => ({
    user: interaction._id.user,
    score: interaction.totalScore,
    level: calculateLevel(interaction.totalScore)
  }));

  const RankingModel = mongoose.model("Ranking");
  const ranking = await RankingModel.findOne({
    date: {
      $gte: new Date(today.getFullYear(), today.getMonth())
    }
  }).exec();
  let data;
  if (!ranking) {
    data = {
      isCoreTeam: isCoreTeam,
      users: ranking_users,
      date: today
    };
    const instance = new RankingModel(data);
    instance.save();
    await closeRanking(today);
  } else {
    ranking.users = ranking_users;
    ranking.save();
  }
};

const sendToChannel = async () => {
  const today = new Date(Date.now());
  const roomname = process.env.ROCKET_DEFAULT_CHANNEL;
  const limit_ranking = 5;
  let response = {
    msg: "Veja as primeiras pessoas do ranking:",
    attachments: []
  };
  let allUsers = await userController.findAll(false, 0);
  let usersFromApi = [];
  for (let user of allUsers) {
    let name;
    let network;
    if (user.rocketId) {
      let response = await rocket_info(user.rocketId);
      name = response.data.user.name;
      network = "rocket";
    } else {
      name = user.name;
      network = "slack";
    }
    usersFromApi.push({
      name: name,
      user_id: user.rocketId ? user.rocketId : user.slackId,
      network: network
    });
  }
  const rankingMonthly = await monthly(today.getMonth() + 1);
  if (rankingMonthly.text) {
    response = rankingMonthly;
  } else if (!rankingMonthly.text && rankingMonthly.users.length == 0) {
    response = { text: "Ops! Ainda ninguém pontuou. =/" };
  } else {
    const limit_users = rankingMonthly.users.slice(0, limit_ranking);
    response.attachments = await limit_users.map((user, index) => ({
      text: `${index + 1}º lugar está ${
        usersFromApi.find(u => u.user_id === user.user).name
      } com ${user.score} XP, no nível ${user.level}`
    }));
  }

  await driver.sendToRoom(response, roomname);
};

const index = async (req, res) => {
  let month = new Date(Date.now()).getMonth();
  let monthName = monthNames[month];
  if (req.params.month && (await valid_month(req.params.month))) {
    month = req.params.month;
    monthName = monthNames[month - 1];
  } else {
    month += 1;
  }
  let allUsers = await userController.findAll(false, 0);
  let usersFromApi = [];
  for (let user of allUsers) {
    let name;
    if (user.rocketId) {
      let response = await rocket_info(user.rocketId);
      name = response.data.user.name;
    }
    usersFromApi.push({
      name: name,
      user_id: user.rocketId
    });
  }
  let first_users = [];
  let last_users = [];
  let error = null;
  const rankingMonthly = await monthly(month);
  if (!rankingMonthly.text && rankingMonthly.users.length === 0) {
    error = "Ops! Ainda ninguem pontuou. =/";
  } else if (rankingMonthly.text) {
    error = rankingMonthly.text;
  } else if (!rankingMonthly.text && rankingMonthly.users.length < 3) {
    error = "Ops! Ranking incompleto.";
  } else {
    const users = rankingMonthly.users.slice(0, 20).map((user, index) => ({
      name: usersFromApi.find(u => u.user_id == user.user).name,
      xp: user.score,
      level: user.level,
      position: index + 1,
      avatar: `https://${
        process.env.ROCKET_HOST
      }/api/v1/users.getAvatar?userId=${user.user}`
    }));

    first_users = users.slice(0, 3);
    last_users = users.slice(3, 20);
    const first = first_users[0];
    const second = first_users[1];
    first_users[0] = second;
    first_users[1] = first;
  }

  const initialData = {
    title: "Ranking",
    first_users: first_users,
    last_users: last_users,
    monthName: monthName,
    error: error
  };

  renderScreen(res, "Ranking", initialData);
};

export default {
  bot_index,
  index,
  monthly,
  findBy,
  findAll,
  myPosition,
  save,
  sendToChannel
};
