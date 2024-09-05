const jwt = require("jsonwebtoken");
require("dotenv").config();

const authenticate = (SECRET_KEY) => {
  return async (req, res, next) => {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      return res.status(403).json({
        message: "Authorization header not found",
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(403).json({
        message: "Token not found",
      });
    }

    try {
      const decoded = await jwt.verify(
        token,
        SECRET_KEY === "reset"
          ? process.env.JWT_SECRET_KEY_RESETPASSWORD
          : process.env.JWT_SECRET_KEY
      );

      req.user = decoded;
      next();
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
};

module.exports = authenticate;
