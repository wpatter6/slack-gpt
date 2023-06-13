import { config } from "dotenv-flow";
import express from "express";

config();

import { initialize } from "./bot";

initialize();

const app = express();

app.get("/health", function (req, res) {
  res.send("Hello World");
});

app.listen(Number(process.env.PORT || 3000));
