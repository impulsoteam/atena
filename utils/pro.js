import rocketApi from "../rocket/api";

export const isEligibleToPro = async (user, data = {}) =>
  (data.current_plan && data.current_plan.name) ||
  user.level > 2 ||
  (await hasAllowedRole(user));

export const hasAllowedRole = async user => {
  const rocketUser = await rocketApi.getUserInfo(user.rocketId);
  const allowedRoles = ["moderator", "owner", "ambassador"];
  const roles = rocketUser.roles.filter(r => allowedRoles.includes(r));
  return roles.length > 0;
};
