import cronUsersInactivity from "./inactivity";
import inactivityAchievements from "./inactivityAchievements";
import cronRanking from "./ranking";
import cronWorkers from "./workers";

export default () => {
  cronUsersInactivity();
  cronRanking();
  inactivityAchievements();
  cronWorkers();
};
