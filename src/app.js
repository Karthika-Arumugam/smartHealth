const express = require("express");
const userRouter = require("./routers/user");
require("dotenv").config();
console.log(process.env);
const port = process.env.PORT;
console.log(process.env.PORT);
require("./db/db");

const app = express();

app.use(express.json());
app.use(userRouter);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
