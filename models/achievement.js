import mongoose from "mongoose";

const achievementSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: [
      "Network",
      "Team",
      "Academy",
      "Mentoring",
      "Meetups",
      "Research",
      "Nucleos",
      "Missoes"
    ],
    required: true
  },
  actions: {
    type: [
      {
        type: String,
        enum: ["Reaction", "Message", "Reply"],
        required: true
      }
    ],
    required: true
  },
  ratings: {
    type: [
      {
        name: {
          type: String,
          required: true
        },
        range: {
          type: Number,
          required: true
        }
      }
    ],
    required: true
  },
  xp: {
    type: Number,
    required: true
  },
  active: {
    type: Boolean,
    required: true,
    default: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

achievementSchema.path("ratings").validate(ratings => {
  const uniqueRatings = ratings.filter(
    (e, i) => ratings.findIndex(a => a.range === e.range) === i
  );

  return uniqueRatings.length === ratings.length;
}, "Error repeated ratings send to achievement");

export default mongoose.model("Achievement", achievementSchema);
