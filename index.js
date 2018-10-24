import autoprefixer from "autoprefixer";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import path from "path";
import postcssMiddleware from "postcss-middleware";
import sassMiddleware from "node-sass-middleware";
import winston from "winston";
import runCrons from "./cron";

import appRoutes from "./routes";
require("./models/interaction");
require("./models/user");

runCrons();

const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [
    new winston.transports.Console({
      colorize: true,
      timestamp: `${new Date().toLocaleDateString()} [${new Date().toLocaleTimeString()}]`
    }),
    new winston.transports.File({
      filename: "error.log",
      level: "error"
    }),
    new winston.transports.File({
      filename: "combined.log"
    })
  ]
});

if (process.env.NODE_ENV !== "production") {
  dotenv.config();
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple()
    })
  );
}

mongoose.connect(process.env.MONGODB_URI);
mongoose.set("useCreateIndexes", true);

const port = process.env.PORT;
const app = express();

app.set("view engine", "pug");

// app.use(
//   bodyParser.json({
//     verify: function(req, res, buf) {
//       var url = req.originalUrl;
//       console.log("url", url, url.startsWith("/slack/events"));
//       if (url.startsWith("/slack/events")) {
//         req.rawBody = buf.toString();
//       }
//     }
//   })
// );

app.use(
  sassMiddleware({
    src: path.join(__dirname, "stylesheets"),
    dest: path.join(__dirname, "public"),
    debug: true,
    outputStyle: "compressed"
  })
);
app.use(
  postcssMiddleware({
    src: req => path.join("./", req.path),
    plugins: [
      autoprefixer({
        browsers: ["> 1%", "IE 7"],
        cascade: false
      })
    ]
  })
);
app.use(express.static("public"));
app.use("/", appRoutes);

app.listen(port, () => console.info(`Listening on port ${port}`));
