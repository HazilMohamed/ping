import * as ping from "ping";
import express, { response } from "express";

const pingRouter = express.Router();

const pingMonitor = (url: string, timeOut: number, callback: Function) => {
  ping.promise.probe(url).then(
    function (out) {
      if (out && out.time < timeOut) {
        return callback({
          success: true,
          message: "Pinged Successfully",
          ...out,
        });
      } else {
        return callback({
          success: false,
          message: out.alive ? "Exceeds given time limit" : "URL not found",
        });
      }
    },
    function (err) {
      return callback({
        success: false,
        message: "Something went wrong!",
        ...err,
      });
    }
  );
};

pingRouter.get("/", (req, res) => {
  res.send("hello from ping");
});

pingRouter.post("/", (req, res) => {
  const url: string = req.body.url,
    timeOut = req.body.timeOut;
  pingMonitor(url, timeOut, function (out: any) {
    res.json(out);
  });
});

export default pingRouter;
