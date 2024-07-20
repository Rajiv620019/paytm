const { JWT_SECRET } = require("./config");
const jwt = require("jsonwebtoken");

const authMiddelware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(403).json({
      message: "Invalid Token",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decodedId = jwt.verify(token, JWT_SECRET);

    req.userId = decodedId.userId;

    next();
  } catch (error) {
    return res.status(403).json({
      message: "No User found",
    });
  }
};

module.exports = {
  authMiddelware,
};
