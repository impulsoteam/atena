import mongoose from "mongoose";
require("./models/interaction");

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/jumanji");
mongoose.set("useCreateIndexes", true);
