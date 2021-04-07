import jwt from "jsonwebtoken";
require("dotenv").config();

const authorize = (req: any, res: any, next: any) => {
  const token = req.header("jwt_token");

  if (!token) {
    return res.status(403).json({ msg: "authorization denied" });
  }

  try {
    const verify: any = jwt.verify(token, process.env.jwtSecret);

    req.user = verify.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};

export default authorize;
