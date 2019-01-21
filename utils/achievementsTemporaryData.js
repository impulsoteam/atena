import moment from "moment-timezone";
import AchievementTemporary from "../models/achievementTemporary";

export const generateKind = data => {
  let kind = null;

  if (data.category && data.action && data.type) {
    kind = `${data.category.toLowerCase()}.${data.action.toLowerCase()}.${data.type.toLowerCase()}`;
  }
  return kind;
};

export const convertToAchievementsTemporary = achievementsTemporaryData => {
  return achievementsTemporaryData.map(achievementTemporaryData => {
    let achievementTemporary = generateNewTemporaryAchievement(
      achievementTemporaryData
    );
    achievementTemporary.ratings = generateNewRatings(achievementTemporaryData);
    return achievementTemporary;
  });
};

const generateNewRatings = achievementTemporaryData => {
  let lastDate = getInitialDate(achievementTemporaryData.initialDate);
  return achievementTemporaryData.ratings.map(rating => {
    let newRating = generateNewRating(rating, lastDate);
    lastDate = getNextDay(newRating.limitDate);
    return newRating;
  });
};

const generateNewRating = (rating, lastDate) => {
  return {
    name: rating.name,
    xp: rating.xp,
    total: 0,
    initialDate: lastDate,
    limitDate: getLimitDate(lastDate),
    ranges: rating.ranges
  };
};

const getInitialDate = date => {
  let initialDate = moment
    .tz(new Date(date), "America/Sao_Paulo")
    .startOf("day");
  let today = moment.tz(new Date(), "America/Sao_Paulo").startOf("day");
  let diffFromToday = moment(initialDate).diff(today, "days");

  if (diffFromToday < 0) initialDate = today;
  return initialDate.format();
};

const getLimitDate = date => {
  let limitDate = moment(date);
  return limitDate
    .add(1, "days")
    .endOf("day")
    .toISOString();
};

const getNextDay = date => {
  let nextDate = moment(date);
  return nextDate
    .startOf("day")
    .add(1, "days")
    .toISOString();
};

const generateNewTemporaryAchievement = achievementTemporaryData => {
  let achievementTemporary = new AchievementTemporary();
  achievementTemporaryData.schema.eachPath(path => {
    if (!["_id", "__v", "rating"].includes(path)) {
      achievementTemporary[path] = achievementTemporaryData[path];
    }
  });
  achievementTemporary.ratings = [];
  return achievementTemporary;
};
