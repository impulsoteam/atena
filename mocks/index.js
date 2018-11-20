const message = {
  type: "message",
  user: "UCX1DSFEV",
  text: "Uma nova mensagem",
  client_msg_id: "f3d872be-b375-49f3-9a9e-894a63dd4caf",
  ts: "1537480361.000100",
  channel: "CCXCENQMP",
  event_ts: "1537480361.000100",
  channel_type: "channel"
};

const thread = {
  type: "message",
  user: "UCX1DSFEV",
  text: "Uma nova thread",
  client_msg_id: "44e893a5-c61b-4591-9dc2-03f17d9fa84c",
  thread_ts: "1537480404.000100",
  parent_user_id: "UCX1DSFEV",
  ts: "1537480620.000100",
  channel: "CCWSMJZ6U",
  event_ts: "1537480620.000100",
  channel_type: "channel"
};

const reactionAdded = {
  type: "reaction_added",
  user: "UCX1DSFEV",
  item: {
    type: "message",
    channel: "CCWSMJZ6U",
    ts: "1537480404.000100"
  },
  reaction: "grin",
  item_user: "UCX1DSFEV",
  event_ts: "1537480644.000100"
};

const reactioRemoved = {
  type: "reaction_removed",
  user: "UCX1DSFEV",
  item: {
    type: "message",
    channel: "CCXCXJWBW",
    ts: "1537453293.000200"
  },
  reaction: "persevere",
  event_ts: "1537559720.000100"
};

const manualPoints = {
  type: "manual",
  user: "UCX1DSFEV",
  value: 20
};

export default {
  message,
  reactionAdded,
  reactioRemoved,
  thread,
  manualPoints
};
