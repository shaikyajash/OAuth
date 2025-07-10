const jwt = require("jsonwebtoken");
const User = require("../models/User");

//  authorization middleware for protected routes

const protect = async (req, res, next) => {
  try {
    let token;


    // Get token from cookies or authorization header
    if (req.cookies?.accessToken) {
      token = req.cookies.accessToken;
    } else if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: "Not authorized to access this route" });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.ACCESS_SECRET);

    req.user = decoded;
    next();
    
  } catch (error) {
    console.error(error.message);
    return res.status(401).json({ message: "Not authorized to access this route" });
  }
};


// Role Based Authorization

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `User role ${req.user.role} is not authorized to access this route`,
      });
    }
    next();
  };
};

module.exports = { protect, authorize };
