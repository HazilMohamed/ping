import { Router } from "express";
import pool from "../../db";

const addUrlRouter = Router();

addUrlRouter.get("/", (req, res) => {
  res.send("hello from addUrl");
});

addUrlRouter.post("/", async (req, res) => {
  const { userId, url, timeOut, ping } = req.body;
  try {
    const userUrl = await pool.query(
      "SELECT * FROM usersites WHERE user_id = $1 and url = $2",
      [userId, url]
    );

    if (userUrl.rows.length > 0) {
      return res.send({
        status: 401,
        success: false,
        message: "URL already exists",
      });
    }

    const result = await pool.query(
      "INSERT INTO usersites (user_id, url, url_timeOut) VALUES ($1, $2, $3) RETURNING *",
      [userId, url, timeOut]
    );

    if (result.rows.length > 0) {
      const addPing = await pool.query(
        "INSERT INTO pingData (usersite_id, ping) VALUES ($1, $2) RETURNING *",
        [result.rows[0].usersite_id, ping]
      );
      let fetched = result.rows;
      let updatedResults: Array<any> = [];
      for (let f of fetched) {
        const pingData = await pool.query(
          "SELECT * FROM pingData WHERE usersite_id =$1",
          [f.usersite_id]
        );
        if (pingData && pingData.rows.length > 0) {
          f.pingData = pingData.rows;
        }
        updatedResults = [...updatedResults, f];
      }
      if (addPing.rows.length > 0) {
        return res.json({
          status: 200,
          success: true,
          message: "Added successful",
          data: updatedResults,
        });
      }
    }
  } catch (err) {
    console.log(err.message);
    res.json({
      status: 500,
      message: "Somthing went wrong!",
      success: false,
    });
  }
});

export default addUrlRouter;
