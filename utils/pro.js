import { userRoles } from "./rocket";

export const isEligibleToPro = user =>
  (user.current_plan && user.current_plan.name) ||
  (!user.pro && user.level > 5) ||
  userRoles(user.roles);
