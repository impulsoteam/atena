import mongoose from "mongoose";

const achievementSchema = new mongoose.Schema({
  name: {
    type: String, // Network | Resposta Recebidas
    required: true
  },
  kind: {
    type: String, // network.reply.received
    required: true
  },
  user: {
    type: String,
    required: true
  },
  total: {
    type: Number,
    default: 0
  },
  ratings: [
    {
      name: String,
      xp: Number,
      ranges: [
        {
          name: String,
          value: Number,
          earnedDate: Date
        }
      ]
    }
  ]
});

export default mongoose.model("Achievement", achievementSchema);
