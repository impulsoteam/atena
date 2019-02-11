import mongoose from "mongoose";
import { doLevelChangeActions } from "../utils/levels";
import { isNewLevel } from "../utils/achievementsLevel";

export const userSchema = new mongoose.Schema({
  avatar: {
    type: String,
    required: false
  },
  name: {
    type: String,
    required: true
  },
  level: {
    type: Number,
    required: true,
    default: 0,
    set: function(name) {
      this._previousLevel = this.level;
      return name;
    }
  },
  score: {
    type: Number,
    required: true,
    default: 0
  },
  slackId: {
    type: String,
    required: false
  },
  rocketId: {
    type: String,
    required: false
  },
  email: {
    type: String,
    required: false
  },
  messages: {
    type: Number,
    required: false,
    default: 0
  },
  replies: {
    type: Number,
    required: false,
    default: 0
  },
  reactions: {
    positives: {
      type: Number,
      required: false,
      default: 0
    },
    negatives: {
      type: Number,
      required: false,
      default: 0
    },
    others: {
      type: Number,
      required: false,
      default: 0
    }
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
  githubId: {
    type: String,
    required: false
  },
  disqusUsername: {
    type: String,
    required: false
  },
  teams: {
    type: Array,
    required: false
  }
});

userSchema.pre("save", function(next) {
  if (
    this.isModified("level") &&
    this._previousLevel != 0 &&
    isNewLevel(this._previousLevel, this.level)
  ) {
    doLevelChangeActions(this._id, this._previousLevel, this.level).then(
      function(resp) {
        next();
      }
    );
  } else {
    next();
  }
});

export default mongoose.model("User", userSchema);
