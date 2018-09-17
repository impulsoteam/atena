import mongoose from "mongoose";

const normalize = data => {
  if (data.type === "reaction_added") {
    return {
      type: data.type,
      channel: data.item.channel,
      description: data.reaction,
      user: data.item_user,
      thread: false,
      messageIdentifier: data.event_ts,
      parentMessage: data.item.ts,
      date: new Date()
    };
  } else if (data.thread_ts) {
    return {
      type: "thread",
      channel: data.channel,
      description: data.text,
      user: data.user,
      thread: true,
      messageIdentifier: data.ts,
      parentMessage: data.event_ts,
      date: new Date()
    };
  } else {
    return {
      type: "message",
      channel: data.channel,
      description: data.text,
      user: data.user,
      thread: false,
      messageIdentifier: data.ts,
      parentMessage: null,
      date: new Date()
    };
  }
};

const save = async data => {
  const InteractionModel = mongoose.model("Interaction");
  const interaction = normalize(data);
  const instance = new InteractionModel(interaction);
  const response = instance.save();
  if (!response) {
    throw new Error("Error adding new interaction");
  }
  return true;
};

const findByUser = async user => {
  const InteractionModel = mongoose.model("Interaction");
  const result = await InteractionModel.find({
    user
  }).exec();
  if (!result) {
    throw new Error("Error finding interactions");
  }
  return result;
};

export default {
  save,
  findByUser
};
