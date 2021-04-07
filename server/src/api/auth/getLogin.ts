import express from "express";
import bcrypt from "bcrypt";
import pool from "../../db";
import validation from "../../middleware/validate";
import jwtGenerator from "../../utils/jwtGen";

const loginRouter = express.Router();

loginRouter.get("/", (req, res) => {
  res.send("hello from login");
});

loginRouter.post("/", validation, async (req, res) => {
  const { name, password } = req.body;

  try {
    const user = await pool.query("SELECT * FROM users WHERE user_name = $1", [
      name,
    ]);

    if (user.rows.length === 0) {
      return res.send({
        status: 401,
        success: false,
        message: "Invalid Credential",
      });
    }

    const validPassword = await bcrypt.compare(
      password,
      user.rows[0].user_password
    );

    if (!validPassword) {
      return res.send({
        status: 401,
        success: false,
        message: "Invalid Credential",
      });
    }
    const jwtToken = jwtGenerator(user.rows[0].user_id);
    return res.json({
      status: 200,
      success: true,
      message: "Login successfull",
      token: jwtToken,
      userId: user.rows[0].user_id,
    });
  } catch (err) {
    console.error(err.message);
    res.json({
      status: 500,
      message: "Somthing went wrong!",
      success: false,
    });
  }
});

export default loginRouter;
