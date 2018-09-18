import mongoose from "mongoose";

const update = async data => {
  const InteractionModel = mongoose.model("User");
  const interaction = data;
  // const instance = new InteractionModel(interaction);
  // const response = instance.save();
  // if (!response) {
  //   throw new Error("Error adding new interaction");
  // }
  // return true;
};

export default {
  update
};
