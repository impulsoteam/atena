import { isValidToken } from "../utils/teams";

const isMiner = async (req, res) => {
  const miner = /miner/g;
  const { team, token } = req.headers;
  const isMiner = miner.test(req.originalUrl) || false;
  if ((isMiner && !team) || (isMiner && !isValidToken(team, token))) {
    res.sendStatus(401);
    return;
  }
  return isMiner;
};
const exportFunctions = {
  isMiner
};

export default exportFunctions;
