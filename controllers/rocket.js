import config from "config-yml";

const normalize = data => {
  const dateMessage = data.history
    ? new Date(data.ts).toLocaleString("en-US")
    : new Date(data.ts["$date"]).toLocaleString("en-US");
  let response = {
    origin: "rocket",
    category: config.categories.network.type,
    channel: data.rid,
    date: dateMessage,
    type: exportFunctions.type(data)
  };
  if (data.reactions) {
    const reactions = data.reactions;
    response = {
      ...response,
      description: Object.keys(reactions).pop(),
      parentUser: data.u._id,
      user: null,
      action: config.actions.reaction.type,
      score: config.xprules.reactions.send
    };
  } else {
    if (data.attachments) {
      data.msg = "attachment";
    }
    response = {
      ...response,
      description: data.msg,
      user: data.u._id,
      username: data.u.name,
      rocketUsername: data.u.username,
      action: config.actions.message.type,
      score: config.xprules.messages.send
    };
  }
  return response;
};

const type = data => {
  let type = "message";
  if (data.reactions) {
    type = "reaction_added";
  }
  return type;
};

const exportFunctions = {
  normalize,
  type
};

export default exportFunctions;
