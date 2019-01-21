import moment from "moment";

export const generateKind = data => {
  let kind = null;

  if (data.category && data.action && data.type) {
    kind = `${data.category.toLowerCase()}.${data.action.toLowerCase()}.${data.type.toLowerCase()}`;
  }

  return kind;
};

export const calculateRatingsDate = data => {
  let lastDate = Date.now();

  return data.ratings.map(rating => {
    rating.initialDate = lastDate;
    rating.limitDate = getLimitDate(lastDate);
    lastDate = moment(rating.limitDate).add(1, "days");
    return rating;
  });
};

const getInitialDate = date => {
  let initialDate = date;
  // let currentDate = moment(date).diff(Date.now(), "days");

  return initialDate;
};

const getLimitDate = date => {
  return moment(date).add(1, "days");
};
