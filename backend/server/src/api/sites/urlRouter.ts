import { Router } from "express";

import allUrlRouter from "./getAllUrl";
import addUrlRouter from "./addUrl";
import updateUrlRouter from "./updateUrl";
import deleteUrlRouter from "./deleteUrl";

const urlRouter = Router();

urlRouter.get("/", (req, res) => {
  res.send("hello from sites");
});

urlRouter.use("/all", allUrlRouter);
urlRouter.use("/add", addUrlRouter);
urlRouter.use("/update", updateUrlRouter);
urlRouter.use("/delete", deleteUrlRouter);

export default urlRouter;
