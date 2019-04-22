import moment from "moment-timezone";
import config from "config-yml";

import { isChatInteraction } from "./interactions";

const today = moment(new Date())
  .utc()
  .format();

const getCurrentScoreToIncrease = achievement => {
  let score = 0;
  const last = defaultFunctions.getLastAchievementRatingEarned(achievement);
  const ranges = last.rating.ranges;
  const range = ranges[ranges.length - 1];

  if (
    range.earnedDate &&
    (!achievement.total || achievement.total === range.value)
  ) {
    score = last.rating.xp;
  }

  return score;
};

const getScoreToIncrease = achievement => {
  let score = 0;

  if (achievement && achievement.ratings.length) {
    score = achievement.ratings.reduce((total, rating) => {
      const totalRanges = rating.ranges.length;
      const earneds = rating.ranges.filter(range => range.earnedDate);
      return total + (earneds.length == totalRanges ? rating.xp : 0);
    }, 0);
  }

  return score;
};

const getInteractionType = interaction => {
  let type = interaction.type;

  if (isChatInteraction(interaction)) {
    type = "sended";
  }

  return type;
};

const getAchievementCurrentRating = achievement => {
  let currentRating = {};
  let ranges = [];

  if (achievement.ratings.length) {
    for (let rating of achievement.ratings) {
      ranges = rating.ranges.filter(range => range.earnedDate);
      if (!ranges.length) break;
      const lastRange = ranges[ranges.length - 1];
      currentRating = defaultFunctions.convertToRating(
        achievement,
        rating,
        lastRange
      );
    }
  }

  return currentRating;
};

const getAchievementNextRating = achievement => {
  let nextRating = {};
  let ranges = [];

  if (achievement.ratings.length) {
    for (let rating of achievement.ratings) {
      ranges = rating.ranges.filter(range => !range.earnedDate);

      if (ranges.length) {
        nextRating = defaultFunctions.convertToRating(
          achievement,
          rating,
          ranges[0]
        );
        break;
      }
    }
  }

  return nextRating;
};

const getLastAchievementRatingEarned = achievement => {
  let lastRatingEarned = {};
  let lastRangeEarned = {};

  let ratings = achievement.ratings.filter(rating => {
    let lastRangeFromRating = rating.ranges.filter(range => range.earnedDate);
    if (lastRangeFromRating.length) {
      lastRangeEarned = lastRangeFromRating[lastRangeFromRating.length - 1];
      return true;
    }
  });

  lastRatingEarned = ratings[ratings.length - 1];

  if (lastRatingEarned && lastRangeEarned) {
    return {
      name: achievement.name,
      rating: lastRatingEarned || [],
      range: lastRangeEarned || []
    };
  }

  return achievement.record || {};
};

const calculateAchievementScoreToIncrease = achievement => {
  let scoreToIncrease = 0;
  const today = moment(new Date());

  achievement.ratings.map(rating => {
    let ranges = rating.ranges;
    let lastRange = ranges[ranges.length - 1];
    let lastEarnedDate = lastRange.earnedDate;

    if (
      lastEarnedDate != null &&
      moment(lastEarnedDate).isSame(today, "day") &&
      (!achievement.total || achievement.total == lastRange.value)
    ) {
      scoreToIncrease = rating.xp;
    }
  });

  return scoreToIncrease;
};

const getLevelRecord = achievement => {
  const lastRating = getLastAchievementRatingEarned(achievement);
  let newRecord = convertToLevelRecord(lastRating, achievement);

  if (
    !achievement.record ||
    !achievement.record.name ||
    !achievement.record.level ||
    newRecord.level > achievement.record.level
  ) {
    return newRecord;
  }

  return achievement.record;
};

const getRecord = achievement => {
  const lastRating = getLastAchievementRatingEarned(achievement);
  let newRecord = convertToRecord(lastRating, achievement);

  if (
    achievement.record &&
    !newEarnedIsBiggerThenCurrent(newRecord, achievement.record)
  ) {
    newRecord = achievement.record;
  }

  return newRecord;
};

const newEarnedIsBiggerThenCurrent = (newEarned, current) => {
  if (!current || !current.name) return true;

  const positionRatings = getPositionRatings();
  let newPosition = positionRatings.findIndex(
    name => name.toLowerCase() == newEarned.name.toLowerCase()
  );

  let currentPosition = positionRatings.findIndex(
    name => name.toLowerCase() == current.name.toLowerCase()
  );

  if (newPosition == currentPosition) {
    const type = current.level && newEarned.level ? "level" : "total";
    return newEarned[type] >= current[type];
  } else {
    return newPosition > currentPosition;
  }
};

const convertToLevelRecord = (lastRating, achievement) => {
  if (lastRating.rating && lastRating.range) {
    return {
      name: lastRating.rating.name,
      range: lastRating.range.name,
      level: lastRating.range.value,
      earnedDate: today
    };
  }

  return achievement.record;
};

const convertToRecord = (lastRating, achievement) => {
  if (lastRating.rating && lastRating.range) {
    return {
      name: lastRating.rating.name,
      range: lastRating.range.name,
      total: lastRating.range.value,
      earnedDate: today
    };
  }

  return achievement.record;
};

const getPositionRatings = () => {
  return Object.keys(config.ratings).map(key => config.ratings[key]);
};

const convertToRating = (achievement, rating, range) => {
  return {
    name: achievement.name,
    rating: rating.name,
    xp: rating.xp,
    range: range.name,
    total: range.value
  };
};

const defaultFunctions = {
  getCurrentScoreToIncrease,
  getLastAchievementRatingEarned,
  getScoreToIncrease,
  getInteractionType,
  getAchievementCurrentRating,
  getAchievementNextRating,
  calculateAchievementScoreToIncrease,
  getLevelRecord,
  getRecord,
  newEarnedIsBiggerThenCurrent,
  convertToRating
};

export default defaultFunctions;
