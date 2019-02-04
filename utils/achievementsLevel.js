import moment from "moment";
import config from "config-yml";

const today = moment(new Date())
  .utc()
  .format();

export const setRangesEarnedDates = (achievement, level) => {
  achievement.ratings = achievement.ratings.map(rating => {
    rating.ranges = rating.ranges.map(range => {
      if (range.value <= level) {
        if (!range.earnedDate) range.earnedDate = today;
      } else {
        range.earnedDate = null;
      }

      return range;
    });
    return rating;
  });

  return achievement;
};

export const getRecord = achievement => {
  const lastRating = getLastRatingEarned(achievement);
  let newRecord = convertToRecord(lastRating, achievement);

  if (achievement.record) {
    if (!newEarnedIsBiggerThenCurrent(newRecord, achievement.record)) {
      newRecord = achievement.record;
    }
  }

  return newRecord;
};

export const getLastRatingEarned = achievement => {
  let lastRatingEarned = {};
  let lastRangeEarned = {};

  let ratings = achievement.ratings.filter(rating => {
    let lastRangeFromRating = rating.ranges
      .filter(range => range.earnedDate)
      .pop();
    if (lastRangeFromRating) {
      lastRangeEarned = lastRangeFromRating;
      return true;
    }
  });

  lastRatingEarned = ratings.pop();
  return {
    rating: lastRatingEarned,
    range: lastRangeEarned
  };
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

const newEarnedIsBiggerThenCurrent = (newEarned, current) => {
  const positionRatings = getPositionRatings();
  let newPosition = positionRatings.findIndex(
    name => name.toLowerCase() == newEarned.name.toLowerCase()
  );

  let currentPosition = positionRatings.findIndex(
    name => name.toLowerCase() == current.name.toLowerCase()
  );

  if (newPosition == currentPosition) {
    return newEarned.level >= current.level;
  } else {
    return newPosition > currentPosition;
  }
};

const getPositionRatings = () => {
  return Object.keys(config.ratings).map(key => config.ratings[key]);
};
