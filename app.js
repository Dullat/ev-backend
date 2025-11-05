const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const errorHandler = require("./middleware/errorhandler.middleware");
const notFoundError = require("./errors/NotFound.error");

const authRouter = require("./routes/auth.route");
const stationRouter = require("./routes/station.route");

const app = express();

app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());

app.use("/", authRouter);
app.use("/api/station", stationRouter);

app.get("/status", (req, res) => {
  res.json({
    service: "Ev-project",
    status: "OK",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

app.use((req, res, next) => {
  throw new notFoundError(`Route '${req.originalUrl}' does not exist`);
});

app.use(errorHandler);

module.exports = app;
