import cronUsersInactivity from "./inactivity";
import cronRanking from "./ranking";

export default () => {
  cronUsersInactivity();
  cronRanking();
};
