import express from "express";
import cors from "cors";

import pingRouter from "./api/ping/getPing";
import loginRouter from "./api/auth/getLogin";
import registerRouter from "./api/auth/getRegister";
import verifyRouter from "./api/auth/getVerify";

const app = express();
const port = 8000;

app.get("/", (req, res) => {
  res.send("hello from root");
});

app.use(cors());
app.use(express.json());

app.use("/ping", pingRouter);
app.use("/register", registerRouter);
app.use("/login", loginRouter);
app.use("/verify", verifyRouter);

app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`);
});
