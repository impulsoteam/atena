import mongoose from "mongoose";
import { driver } from "@rocket.chat/sdk";
import userController from "./user";
import interactionController from "./interaction";
import { calculateLevel } from "../utils";
import { renderScreen } from "../utils/ssr";
import { isValidToken } from "../utils/teams";

const myPosition = async (user_id, users) => {
  const user = await userController.getNetwork(user_id);
  const id = user.network === "rocket" ? user.rocketId : user.slackId;
  return users.map(e => e.user).indexOf(id) + 1;
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
  const rankingMonthly = await monthly(month);
  if (rankingMonthly.text) {
    response = rankingMonthly;
  } else if (!rankingMonthly.text && rankingMonthly.users.length === 0) {
    response = { text: "Ops! Ainda ninguém pontuou. =/" };
  } else {
    const limit_users = rankingMonthly.users.slice(0, limit_ranking);
    response.attachments = await limit_users.map((user, index) => ({
      text: `${index + 1}º lugar está ${
        allUsers.find(u => u.rocketId === user.user).name
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
  const rankingMonthly = await monthly(today.getMonth() + 1);
  if (rankingMonthly.text) {
    response = rankingMonthly;
  } else if (!rankingMonthly.text && rankingMonthly.users.length == 0) {
    response = { text: "Ops! Ainda ninguém pontuou. =/" };
  } else {
    const limit_users = rankingMonthly.users.slice(0, limit_ranking);
    response.attachments = await limit_users.map((user, index) => ({
      text: `${index + 1}º lugar está ${
        allUsers.find(u => u.rocketId === user.user).name
      } com ${user.score} XP, no nível ${user.level}`
    }));
  }

  await driver.sendToRoom(response, roomname);
};

const position = async (users, first = 0, limit = 20) =>
  users.slice(first, limit).map((user, index) => ({
    name: user.name,
    xp: user.score,
    level: user.level,
    avatar: user.avatar,
    teams: user.teams || [],
    slackId: user.slackId,
    rocketId: user.rocketId,
    position: index + 1
  }));

const firstUsers = async users => {
  const limit = 3;
  if (users.length < limit) return users;
  let first_users = users.slice(0, limit);
  const first = first_users[0];
  const second = first_users[1];
  first_users[0] = second;
  first_users[1] = first;
  return first_users;
};

const lastUsers = async (users, first = 3, limit = 20) =>
  users.slice(first, limit);

const byTeam = async (users, team) =>
  users
    .filter(u => u.teams.includes(team))
    .map((user, index) => ({
      ...user,
      position: index + 1
    }));

const group = async (users, isCoreTeam = false) => {
  let listCoreTeam = [];
  let listUsers = [];
  for (let user of users) {
    const u = await userController.getNetwork(user.user);
    let avatar = `${process.env.ROCKET_HOST}/api/v1/users.getAvatar?userId=${
      user.user
    }`;
    if (u.network === "slack") avatar = u.avatar;
    const data = {
      name: u.name,
      xp: user.score,
      level: user.level,
      avatar: avatar,
      teams: u.teams || [],
      slackId: u.slackId,
      rocketId: u.rocketId
    };
    if (u.isCoreTeam) {
      listCoreTeam.push(data);
    } else {
      listUsers.push(data);
    }
  }
  return isCoreTeam ? listCoreTeam : listUsers;
};

const miner = async (req, res) => {
  const miner = /miner/g;
  const { team, token } = req.headers;
  const isMiner = miner.test(req.originalUrl) || false;
  if ((isMiner && !team) || (isMiner && !isValidToken(team, token))) {
    res.sendStatus(401);
    return;
  }
  return isMiner;
};

const index = async (req, res) => {
  const isMiner = await miner(req, res);
  const { team, token } = req.headers;

  let month = new Date(Date.now()).getMonth();
  let monthName = monthNames[month];
  if (req.params.month && (await valid_month(req.params.month))) {
    month = req.params.month;
    monthName = monthNames[month - 1];
  } else {
    month += 1;
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
    let users = await group(rankingMonthly.users);
    users = await position(users);
    if (isMiner) users = await byTeam(users, team);
    first_users = await firstUsers(users);
    last_users = await lastUsers(users);
  }

  const initialData = {
    title: "Ranking",
    first_users: first_users,
    last_users: last_users,
    monthName: monthName,
    error: error,
    page: "ranking"
  };

  if (isMiner && isValidToken(team, token)) {
    res.json(initialData);
  } else {
    renderScreen(req, res, "Ranking", initialData);
  }
};

const general = async (req, res) => {
  const isMiner = await miner(req, res);
  const { team, token } = req.headers;
  let first_users = [];
  let last_users = [];
  const limit = isMiner ? 0 : 20;

  let users = await userController.findAll(
    false,
    limit,
    "-email -_id -lastUpdate"
  );
  users = await position(users);
  if (isMiner) users = await byTeam(users, team);
  first_users = await firstUsers(users);
  last_users = await lastUsers(users);
  const initialData = {
    title: "Ranking Geral",
    first_users: first_users,
    last_users: last_users,
    monthName: "GERAL",
    page: "geral"
  };

  if (req.query.format === "json" || (isMiner && isValidToken(team, token))) {
    res.json(initialData);
  } else {
    renderScreen(req, res, "Ranking", initialData);
  }
};

export default {
  bot_index,
  index,
  monthly,
  findBy,
  findAll,
  myPosition,
  save,
  sendToChannel,
  general
};
