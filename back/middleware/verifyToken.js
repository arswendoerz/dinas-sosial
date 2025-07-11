import jwt from "jsonwebtoken";

export const verifyToken = async (req, res, next) => {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized - no token provided",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: "Unthorized - invalid token",
      });
    }

    req.userId = decoded.userId;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token Expired",
      });
    }
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid Token",
      });
    }
    console.error("Error in verifyToken", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const protect = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized - No token provided",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = {
      userId: decoded.userId,
      role: decoded.role,
    };

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" });
    }
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token" });
    }

    console.error("Token verification error:", error);
    return res.status(500).json({ message: "Server error during token check" });
  }
};
