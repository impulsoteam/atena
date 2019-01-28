import UserModel from "../models/user";

export const getUserByOrigin = async interaction => {
  let query = {};

  if (interaction.origin != "sistema") {
    query[`${interaction.origin}Id`] = interaction.user;
  } else {
    query = { _id: interaction.user };
  }

  const user = await UserModel.findOne(query).exec();
  user.network = interaction.origin;
  return user;
};
