import mongoose from "mongoose";
import userController from "./user";

import { _throw, _today } from "../helpers";

const normalize = data => {
  if (data.type === "reaction_added") {
    return {
      channel: data.item.channel,
      date: new Date(),
      description: data.reaction,
      messageIdentifier: data.event_ts,
      parentMessage: data.item.ts,
      parentUser: data.item_user,
      thread: false,
      type: data.type,
      user: data.user
    };
  } else if (data.thread_ts) {
    return {
      channel: data.channel,
      date: new Date(),
      description: data.text,
      messageIdentifier: data.ts,
      parentMessage: data.event_ts,
      parentUser: data.parent_user_id,
      thread: true,
      type: "thread",
      user: data.user
    };
  } else {
    return {
      channel: data.channel,
      date: new Date(),
      description: data.text,
      messageIdentifier: data.ts,
      parentMessage: null,
      thread: false,
      type: "message",
      user: data.user
    };
  }
};

export const save = async data => {
  const InteractionModel = mongoose.model("Interaction");
  const interaction = normalize(data);
  const instance = new InteractionModel(interaction);
  const response = instance.save();
  userController.update(interaction);

  return response || _throw("Error adding new interaction");
};

export const find = async user => {
  const InteractionModel = mongoose.model("Interaction");
  const result = await InteractionModel.find({
    $or: [{ user: user }, { parentUser: user }]
  }).exec();

  return result || _throw("Error finding interactions");
};

export const today = async user => {
  const InteractionModel = mongoose.model("Interaction");
  const result = await InteractionModel.find({
    $or: [{ user: user }, { parentUser: user }],
    date: {
      $gte: _today.start
    }
  }).exec();

  return result || _throw("Error finding interactions today");
};

export default {
  find,
  save,
  today
};
