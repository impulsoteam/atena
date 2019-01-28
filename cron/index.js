import cronUsersInactivity from "./inactivity";
import inactivityAchievements from "./inactivityAchievements";

export default () => {
  cronUsersInactivity();
  inactivityAchievements();
};
