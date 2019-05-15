export const fromPrivateChannel = data => {
  return data.roomType === "p";
};

export const userRoles = roles =>
  roles.filter(r => !["user", "admin", "bot"].includes(r));
