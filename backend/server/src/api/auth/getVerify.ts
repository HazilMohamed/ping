import express from "express";
import authorize from "../../middleware/authorize";

const verifyRouter = express.Router();

verifyRouter.get("/", (req, res) => {
  res.send("hello from verify");
});

verifyRouter.post("/", authorize, (req, res) => {
  try {
    res.json(true);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

export default verifyRouter;
