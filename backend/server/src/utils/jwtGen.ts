import jwt from "jsonwebtoken";
require("dotenv").config();

function jwtGenerator(user_id: any) {
  const payload = {
    user: {
      id: user_id,
    },
  };

  return jwt.sign(payload, process.env.jwtSecret, { expiresIn: "100h" });
}

export default jwtGenerator;
