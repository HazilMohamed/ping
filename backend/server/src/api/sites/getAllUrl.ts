import { Router } from "express";
import pool from "../../db";

const allUrlRouter = Router();

allUrlRouter.get("/", (req, res) => {
  res.send("hello from allUrl");
});

allUrlRouter.post("/", async (req, res) => {
  const { userId } = req.body;
  try {
    const userSites = await pool.query(
      "SELECT * FROM usersites WHERE user_id = $1",
      [userId]
    );
    if (userSites.rows.length === 0) {
      return res.send({
        status: 401,
        success: false,
        message: "No previous URLs found",
      });
    } else {
      let fetched = userSites.rows;
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

      return res.send({
        status: 200,
        success: true,
        message: "Queried successfuly",
        data: updatedResults,
      });
    }
  } catch (err) {
    console.error(err.message);
    res.json({
      status: 500,
      message: "Somthing went wrong!",
      success: false,
    });
  }
});

export default allUrlRouter;
