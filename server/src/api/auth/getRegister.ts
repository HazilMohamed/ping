import express from "express";
import bcrypt from "bcrypt";
import pool from "../../db";
import validation from "../../middleware/validate";
import jwtGenerator from "../../utils/jwtGen";

const registerRouter = express.Router();

registerRouter.get("/", (req, res) => {
  res.send("hello from register");
});

registerRouter.post("/", validation, async (req, res) => {
  const { name, password } = req.body;

  try {
    const user = await pool.query("SELECT * FROM users WHERE user_name = $1", [
      name,
    ]);

    if (user.rows.length > 0) {
      return res.send({
        status: 401,
        success: false,
        message: "User already exists",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const bcryptPassword = await bcrypt.hash(password, salt);

    let newUser = await pool.query(
      "INSERT INTO users (user_name, user_password) VALUES ($1, $2) RETURNING *",
      [name, bcryptPassword]
    );

    const jwtToken = jwtGenerator(newUser.rows[0].user_id);

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

export default registerRouter;
