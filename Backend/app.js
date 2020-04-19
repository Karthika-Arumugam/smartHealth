const express = require("express");
const userRouter = require("./routes/user");
require("dotenv").config();
require("./DAL");

const app = express();

app.use(express.json());
app.use(userRouter);

module.exports = app;

