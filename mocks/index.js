const message = {
  type: "message",
  user: "U7ZD2FCBB",
  text: "Alguém acompanhando a série B?",
  client_msg_id: "c1b5b38d-72ff-473a-af7a-7b7978d72bca",
  ts: "1536960733.000100",
  channel: "C8WEGN82G",
  event_ts: "1536960733.000100",
  channel_type: "channel"
};

const thread = {
  type: "message",
  user: "U7ZD2FCBB",
  text: "que não seja torcedor do goiás é claro :stuck_out_tongue:",
  client_msg_id: "1617748b-6a07-4c84-b38c-2049f2e5e07a",
  thread_ts: "1536960733.000100",
  parent_user_id: "U7ZD2FCBB",
  ts: "1536960877.000100",
  channel: "C8WEGN82G",
  event_ts: "1536960877.000100",
  channel_type: "channel"
};

const reaction = {
  type: "reaction_added",
  user: "U7ZD2FCBB",
  item: {
    type: "message",
    channel: "C81191SJ3",
    ts: "1536861484.000100"
  },
  reaction: "awww_yisss",
  item_user: "UAWNQHH38",
  event_ts: "1536958142.000100"
};

export default {
  message,
  reaction,
  thread
};
