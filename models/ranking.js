import mongoose from "mongoose";
import user from "./user";

const rankingSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true
  },
  closed: {
    type: Boolean,
    required: false,
    default: false
  },
  lastUpdate: {
    type: Date,
    required: true,
    default: Date.now
  },
  isCoreTeam: {
    type: Boolean,
    required: true,
    default: false
  },
  users: [user.schema]
});

export default mongoose.model("Ranking", rankingSchema);
