import moment from "moment-timezone";
import config from "config-yml";

import { isChatInteraction } from "./interactions";

const today = moment(new Date())
  .utc()
  .format();

export const getInteractionType = interaction => {
  let type = interaction.type;

  if (isChatInteraction(interaction)) {
    type = "sended";
  }

  return type;
};

export const getAchievementCurrentRating = achievement => {
  let currentRange = {};
  let currentRating = {};
  if (achievement.ratings.length) {
    for (let rating of achievement.ratings) {
      currentRange = rating.ranges.filter(range => !range.earnedDate);

      if (currentRange.length) {
        currentRating = {
          name: achievement.name,
          rating: rating.name,
          xp: rating.xp,
          range: currentRange[0].name,
          total: currentRange[0].value
        };

        break;
      }
    }
  }

  return currentRating;
};

export const getLastAchievementRatingEarned = achievement => {
  let lastRatingEarned = {};
  let lastRangeEarned = {};

  let ratings = achievement.ratings.filter(rating => {
    let lastRangeFromRating = rating.ranges.filter(range => range.earnedDate);
    if (lastRangeFromRating.length) {
      lastRangeEarned = lastRangeFromRating.pop();
      return true;
    }
  });

  lastRatingEarned = ratings.pop();

  if (lastRatingEarned && lastRangeEarned) {
    return {
      name: achievement.name,
      rating: lastRatingEarned || [],
      range: lastRangeEarned || []
    };
  }

  return achievement.record || {};
};

export const calculateAchievementScoreToIncrease = achievement => {
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

export const getRecord = achievement => {
  const lastRating = getLastAchievementRatingEarned(achievement);
  let newRecord = convertToRecord(lastRating, achievement);

  if (achievement.record) {
    if (!newEarnedIsBiggerThenCurrent(newRecord, achievement.record)) {
      newRecord = achievement.record;
    }
  }

  return newRecord;
};

const convertToRecord = (lastRating, achievement) => {
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

export const newEarnedIsBiggerThenCurrent = (newEarned, current) => {
  if (!current.name) return true;

  const positionRatings = getPositionRatings();
  let newPosition = positionRatings.findIndex(
    name => name.toLowerCase() == newEarned.name.toLowerCase()
  );

  let currentPosition = positionRatings.findIndex(
    name => name.toLowerCase() == current.name.toLowerCase()
  );

  if (newPosition == currentPosition) {
    const type = newEarned.level ? "level" : "total";
    return newEarned[type] >= current[type];
  } else {
    return newPosition > currentPosition;
  }
};

const getPositionRatings = () => {
  return Object.keys(config.ratings).map(key => config.ratings[key]);
};
