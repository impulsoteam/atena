import moment from "moment-timezone";
import rocketApi from "../rocket/api";

export const isEligibleToPro = async user =>
  user.level > 2 || (await hasAllowedRole(user));

export const hasProPlan = async data =>
  Boolean(data.current_plan && data.current_plan.name);

export const hasAllowedRole = async user => {
  const rocketUser = await rocketApi.getUserInfo(user.rocketId);
  const allowedRoles = ["moderator", "owner", "ambassador"];
  const roles =
    rocketUser &&
    rocketUser.roles &&
    rocketUser.roles.filter(r => allowedRoles.includes(r));
  return roles.length > 0;
};

export const isFinishDateBigger = (user, data) =>
  !user.proFinishAt ||
  moment(data.current_plan.finish_at).isSameOrAfter(user.proFinishAt);
