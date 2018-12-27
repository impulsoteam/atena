export const calculateAchievementsPosition = achievements => {
  let ratings = null;
  let achievementsPosition = achievements.map(achievement => {
    let range = null;
    ratings = achievement.ratings.reduce((results, rating) => {
      range = getActiveRange(rating.ranges);

      if (range) {
        results.push(generateRating(rating, range));
      }

      return results;
    }, []);

    return {
      name: achievement.name,
      total: achievement.total,
      rating: getActiveRating(ratings, achievement.ratings)
    };
  });

  return achievementsPosition;
};

const getActiveRating = (ratings, allRatings) => {
  return ratings[0] || getLastRating(allRatings);
};

const generateRating = (rating, range) => {
  return {
    name: `${rating.name} ${range.name}`,
    value: range.value
  };
};

const getLastRating = ratings => {
  const lastRatingIndex = ratings.length - 1;
  const lastRating = ratings[lastRatingIndex];

  const lastRangeIndex = lastRating.ranges.length - 1;
  const lastRange = lastRating.ranges[lastRangeIndex];

  return generateRating(lastRating, lastRange);
};

const getActiveRange = ranges => {
  let activeRange = false;
  let total = ranges.length;

  for (let i = 0; i < total; i++) {
    let range = ranges[i];
    if (!activeRange && range.earnedDate === null) {
      activeRange = {
        name: range.name,
        value: range.value
      };

      break;
    }
  }

  return activeRange;
};
