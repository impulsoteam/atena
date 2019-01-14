import mongoose from "mongoose";
import userController from "./user";
import interactionController from "./interaction";

const myPosition = async (user, users) => {
  return users.map(e => e.id).indexOf(user.id) + 1;
};

const index = async (req, res) => {
  let response = {
    text: "Veja as primeiras pessoas do ranking:",
    attachments: []
  };
  let user_id;
  let month;
  let query_user;

  if (req.headers.origin === "rocket") {
    user_id = req.body.id;
    req.body.user_id = user_id;
    query_user = { rocketId: user_id };
    month = req.body.month;
  } else {
    user_id = req.body.user_id;
    query_user = { slackId: user_id };
    month = req.body.text;
  }

  const user = await userController.findBy(query_user);
  const rankingMonthly = await monthly(month);
  if (rankingMonthly.text) {
    response = rankingMonthly;
  } else if (!rankingMonthly.text && rankingMonthly.users.length == 0) {
    response = { text: "Ops! Ainda ninguém pontuou. =/" };
  } else {
    const limit_users = rankingMonthly.users.slice(0, 5);
    response.attachments = limit_users.map((user, index) => ({
      text: `${index + 1}º lugar está ${user.name} com ${
        user.score
      } XP, no nível ${user.level}`
    }));

    let msg_user;
    if (user) {
      msg_user = `Ah, e você está na posição ${await myPosition(
        user,
        rankingMonthly.users
      )} do ranking`;
    } else {
      msg_user = "Você ainda não pontuou na gamification";
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

const rangeRanking = async (year, month) => {
  // const interactions = await InterActionModel.find({ date: { $gte: new Date(2019, 0), $lt: new Date(2019, 0 + 1) }}).exec();
  const interactions = await interactionController.findBy({
    date: { $gte: new Date(year, month), $lt: new Date(year, month + 1) }
  });
  // agora preciso percorrer as interaction e contar os pontos
  interactions.map(interaction => {
    console.log(interaction.user);
  });

  // console.log(interactions);
};

const save = async (isCoreTeam = false) => {
  let data;
  const RankingModel = mongoose.model("Ranking");
  // const today = Date(Date.now());
  // $gte: new Date(2016,09,30)
  // console.log("QUERO O DIA DE HOJE", today.getMonth(), today.getFullYear());
  const today = new Date(Date.now());
  const users = await userController.findAll(isCoreTeam, 0);
  const ranking = await RankingModel.findOne({
    date: {
      $gte: new Date(today.getFullYear(), today.getMonth())
    }
  }).exec();

  if (!ranking) {
    data = {
      isCoreTeam: isCoreTeam,
      users: users,
      date: today
    };
    const instance = new RankingModel(data);
    instance.save();
  } else {
    ranking.users = users;
    ranking.save();
  }
  // if today is first day, update de ranking and close the month before
  await rangeRanking(today.getFullYear(), today.getMonth());
};

export default {
  index,
  monthly,
  findBy,
  findAll,
  myPosition,
  save
};
