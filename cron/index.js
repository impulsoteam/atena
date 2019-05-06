import cronUsersInactivity from "./inactivity";
import inactivityAchievements from "./inactivityAchievements";
import cronRanking from "./ranking";
import cronWorkers from "./workers";
import cronCheckPoints from "./checkpoints";

export default () => {
  cronUsersInactivity();
  cronRanking();
  inactivityAchievements();
  cronWorkers();
  cronCheckPoints();
};
