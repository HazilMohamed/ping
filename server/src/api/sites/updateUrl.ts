import { Router } from "express";
import pool from "../../db";

const updateUrlRouter = Router();

updateUrlRouter.get("/", (req, res) => {
  res.send("hello from updateUrl");
});

updateUrlRouter.post("/", async (req, res) => {
  const { userSiteId, url, timeOut } = req.body;
  try {
    const userUrl = await pool.query(
      "SELECT * FROM usersites WHERE usersite_id = $1",
      [userSiteId]
    );

    if (userUrl.rows.length === 0) {
      return res.send({
        status: 401,
        success: false,
        message: "URL does not exists",
      });
    }

    const result = await pool.query(
      "UPDATE usersites SET url = $1, url_timeOut = $2 WHERE usersite_id = $3 RETURNING *",
      [url, timeOut, userSiteId]
    );

    if (result.rows.length > 0) {
      return res.json({
        status: 200,
        success: true,
        message: "Updated successful",
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

export default updateUrlRouter;
