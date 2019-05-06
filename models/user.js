import mongoose from "mongoose";
import {
  getLevelScore,
  saveLevelHistoryChanges,
  sendLevelMessage
} from "../utils/levels";
import { isNewLevel } from "../utils/achievementsLevel";
import achievementLevelController from "../controllers/achievementLevel";
import { saveScoreInteraction } from "../utils/achievements";

export const userSchema = new mongoose.Schema({
  avatar: {
    type: String,
    required: false
  },
  uuid: {
    type: String,
    required: false
  },
  name: {
    type: String,
    required: true
  },
  username: {
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
    default: ["network"],
    required: false
  },
  linkedinId: {
    type: String,
    required: false
  },
  pro: {
    type: Boolean,
    default: false
  }
});

userSchema.pre("save", async function(next) {
  this.lastUpdate = new Date();
  if (this.isModified("level") && isNewLevel(this._previousLevel, this.level)) {
    await saveLevelHistoryChanges(this._id, this._previousLevel, this.level);
    const achievement = await achievementLevelController.save(
      this._id,
      this._previousLevel,
      this.level
    );

    const score = getLevelScore(achievement);
    if (score > 0) {
      this.score += score;
      await saveScoreInteraction(
        this,
        achievement,
        score,
        "Conquista de Nível"
      );
    }

    await sendLevelMessage(this, achievement);

    next();
  } else {
    next();
  }
});

export default mongoose.model("User", userSchema);
