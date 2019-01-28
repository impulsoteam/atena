import moment from "moment";
import config from "config-yml";
import { getInteractionType } from "./achievements";

const today = moment(new Date())
  .utc()
  .format();

export const addEarnedAchievement = temporaryAchievement => {
  let xpToIncrease = 0;
  if (isInDeadline(temporaryAchievement)) {
    let wasUpdated = false;
    temporaryAchievement.ratings = temporaryAchievement.ratings.map(rating => {
      if (!wasUpdated) {
        let updatedRanges = generateUpdatedRanges(rating);

        if (updatedRanges.wasUpdated) {
          wasUpdated = true;
          temporaryAchievement.lastEarnedDate = today;
        }

        rating.ranges = updatedRanges.ranges;
        if (updatedRanges.xpToIncrease > 0) {
          xpToIncrease = updatedRanges.xpToIncrease;
        }
      }

      return rating;
    });
  }

  return {
    achievement: temporaryAchievement,
    xpToIncrease: xpToIncrease
  };
};

export const getRecord = temporaryAchievement => {
  let newRecord = getLastRatingEarned(temporaryAchievement);

  if (temporaryAchievement.record) {
    if (!newEarnedIsBiggerThenCurrent(newRecord, temporaryAchievement.record)) {
      newRecord = temporaryAchievement.record;
    }
  }

  return newRecord;
};

export const getQueryToFindCurrent = interaction => {
  return {
    kind: getKind(interaction),
    initialDate: { $lte: new Date().toISOString() }
  };
};

export const isBeforeLimitDate = temporaryAchievement => {
  const currentDate = moment(new Date());
  const limitDate = moment(temporaryAchievement.limitDate);
  return limitDate.isSameOrAfter(currentDate);
};

export const isBeforeEndDate = temporaryAchievement => {
  const currentDate = moment(new Date());
  const limitDate = moment(temporaryAchievement.endDate);
  return limitDate.isSameOrAfter(currentDate);
};

export const resetEarnedAchievements = temporaryAchievement => {
  temporaryAchievement.ratings = temporaryAchievement.ratings.map(rating => {
    rating.ranges = rating.ranges.map(range => {
      return {
        name: range.name,
        value: range.value
      };
    });

    rating.total = 0;
    return rating;
  });

  return temporaryAchievement;
};

const isInDeadline = temporaryAchievement => {
  if (temporaryAchievement.lastEarnedDate) {
    const lastEarnedDate = moment(temporaryAchievement.lastEarnedDate);
    const today = moment(new Date());
    const deadlineDate = generateDeadlineDate(
      temporaryAchievement.lastEarnedDate,
      temporaryAchievement.rangeTime
    );

    return !today.isSame(lastEarnedDate, "day") && today.isBefore(deadlineDate);
  }

  return true;
};

const generateDeadlineDate = (date, rangeTime) => {
  let deadlineDate = date;
  if (rangeTime == "daily") {
    deadlineDate = moment(date)
      .add(1, "days")
      .utc()
      .endOf("day")
      .toISOString();
  }

  return deadlineDate;
};

const getLastRatingEarned = temporaryAchievement => {
  let lastRatingEarned = {};
  let lastRangeEarned = {};

  let ratings = temporaryAchievement.ratings.filter(rating => {
    let lastRangeFromRating = rating.ranges
      .filter(range => range.earnedDate)
      .pop();
    if (lastRangeFromRating) {
      lastRangeEarned = lastRangeFromRating;
      return true;
    }
  });

  lastRatingEarned = ratings.pop();
  if (lastRatingEarned && lastRangeEarned) {
    return {
      name: lastRatingEarned.name,
      range: lastRangeEarned.name,
      total: lastRatingEarned.total,
      earnedDate: today
    };
  }

  return temporaryAchievement.record;
};

const newEarnedIsBiggerThenCurrent = (newEarned, current) => {
  const positionRatings = getPositionRatings();
  let newPosition = positionRatings.findIndex(
    name => name.toLowerCase() == newEarned.name.toLowerCase()
  );

  let currentPosition = positionRatings.findIndex(
    name => name.toLowerCase() == current.name.toLowerCase()
  );

  if (newPosition == currentPosition) {
    return newEarned.total >= current.total;
  } else {
    return newPosition > currentPosition;
  }
};

const getPositionRatings = () => {
  return Object.keys(config.ratings).map(key => config.ratings[key]);
};

const generateUpdatedRanges = rating => {
  let newTotal = rating.total + 1;
  let hasXpToIncrease = true;
  let xpToIncrease = 0;
  let wasUpdated = false;

  let ranges = rating.ranges.map(range => {

    if (!range.earnedDate) {
      if (range.value == newTotal) {
        range.earnedDate = today;
        rating.total = newTotal;
        wasUpdated = true;
      } else {
        hasXpToIncrease = false;
      }
    }
    return range;
  });

  if (hasXpToIncrease) xpToIncrease = rating.xp;

  return {
    ranges: ranges,
    xpToIncrease: xpToIncrease,
    wasUpdated: wasUpdated
  };
};

const getKind = interaction => {
  const type = getInteractionType(interaction);
  return `${interaction.category}.${interaction.action}.${type}`;
};
