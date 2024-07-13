import "dotenv/config.js";

import createError from "http-errors";
import express from "express";
import cookieParser from "cookie-parser";
import logger from "morgan";
import notesRouter from "./routes/notes.js";
import cors from "cors";
import { expressMiddleware } from "@apollo/server/express4";
import server from "./graphql.js";

// Constants
const port = process.env.PORT || 3000;

// Create http server
const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());

app.use("/graphql", expressMiddleware(server, {}));

app.use("/notes", notesRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  // res.render("error");
});

// Start http server
app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});
