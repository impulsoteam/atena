import cronUsersInactivity from "./inactivity";
import inactivityAchievements from "./inactivityAchievements";
import cronRanking from "./ranking";

export default () => {
  cronUsersInactivity();
  cronRanking();
  inactivityAchievements();
};
