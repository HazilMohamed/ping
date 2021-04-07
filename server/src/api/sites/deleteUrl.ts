import { Router } from "express";
import pool from "../../db";

const deleteUrlRouter = Router();

deleteUrlRouter.get("/", (req, res) => {
  res.send("hello from deleteUrl");
});

deleteUrlRouter.post("/", async (req, res) => {
  const { userSiteId } = req.body;
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
      "DELETE FROM usersites WHERE usersite_id = $1 RETURNING *",
      [userSiteId]
    );
    if (result.rows.length > 0) {
      return res.json({
        status: 200,
        success: true,
        message: "Deleted successful",
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

export default deleteUrlRouter;
