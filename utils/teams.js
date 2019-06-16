export const isValidToken = (team, token) =>
  process.env[`X_MINER_TOKEN`] === token
