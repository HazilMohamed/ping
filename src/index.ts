import express from "express";
import cors from "cors";

import pingRouter from "./ping/getPing";

const app = express();
const port = 8000;

app.get("/", (req, res) => {
  res.send("hello from root");
});

app.use(cors());
app.use(express.json());

app.use("/ping", pingRouter);

app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`);
});
