import moment from "moment";
import {
  getInteractionType,
  getRecord,
  getCurrentScoreToIncrease,
  getAchievementNextRating,
  saveScoreInteraction
} from "./achievements";
import { convertDataToAchievement } from "./achievementsTemporaryData";
import { sendEarnedAchievementMessage } from "./achievementsMessages";
import userController from "../controllers/user";

const today = moment(new Date())
  .utc()
  .format();

export const createAchievementTemporary = async (temporaryData, user) => {
  let temporaryAchievement = convertDataToAchievement(temporaryData, user._id);
  await sendMessageStart(user, temporaryAchievement);
  return await temporaryAchievement.save();
};

export const updateAchievementTemporary = async (
  temporaryAchievement,
  user
) => {
  if (!isInDeadline(temporaryAchievement)) {
    return temporaryAchievement;
  }

  temporaryAchievement = addEarnedAchievement(temporaryAchievement);
  temporaryAchievement.record = getRecord(temporaryAchievement);
  await addScore(user, temporaryAchievement);
  return await temporaryAchievement.save();
};

const sendMessageStart = async (user, temporaryAchievement) => {
  const current = {
    name: temporaryAchievement.name,
    rating: temporaryAchievement.ratings[0].name,
    range: temporaryAchievement.ratings[0].ranges[0].name
  };

  await sendEarnedAchievementMessage(user, current);
};

const addScore = async (user, temporaryAchievement) => {
  const score = getCurrentScoreToIncrease(temporaryAchievement);
  if (score < 1) return;

  await userController.updateScore(user, score);
  await saveScoreInteraction(
    user,
    temporaryAchievement,
    score,
    "Conquista Temporária"
  );
  await sendEarnedAchievementMessage(
    user,
    getAchievementNextRating(temporaryAchievement)
  );
};

const addEarnedAchievement = temporaryAchievement => {
  let wasUpdated = false;
  temporaryAchievement.ratings = temporaryAchievement.ratings.map(rating => {
    if (!wasUpdated) {
      let updatedRanges = generateUpdatedRanges(rating);
      rating.ranges = updatedRanges.ranges;

      if (updatedRanges.wasUpdated) {
        wasUpdated = true;
        temporaryAchievement.lastEarnedDate = today;
        temporaryAchievement.total += 1;
      }
    }

    return rating;
  });

  return temporaryAchievement;
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

  temporaryAchievement.total = 0;
  return temporaryAchievement;
};

const isInDeadline = temporaryAchievement => {
  if (temporaryAchievement.lastEarnedDate) {
    const lastEarnedDate = moment(temporaryAchievement.lastEarnedDate)
      .utc()
      .format();
    const deadlineDate = generateDeadlineDate(
      temporaryAchievement.lastEarnedDate,
      temporaryAchievement.rangeTime
    );
    const today = moment(new Date()).utc();
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
