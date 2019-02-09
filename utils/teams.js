export const isValidToken = (team, token) =>
  process.env[`TEAM_${team}_TOKEN`] === token;
