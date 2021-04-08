import { Router } from "express";
import pool from "../../db";

const addUrlRouter = Router();

addUrlRouter.get("/", (req, res) => {
  res.send("hello from addUrl");
});

addUrlRouter.post("/", async (req, res) => {
  const { userId, url, timeOut } = req.body;
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
      return res.json({
        status: 200,
        success: true,
        message: "Added successful",
        data: result.rows,
      });
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
