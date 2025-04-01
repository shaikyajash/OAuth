const jwt = require("jsonwebtoken");

const generateJwtToken = (payload) => {
  try {
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "30m",
    });
    return token;
  } catch (error) {
    console.error("Error generating token:", error);
    throw new Error("Token generation failed");
  }
};

const sendCookie = (res, name, value, statusCode = 200, expiryMinutes = 30) => {
  try {
    const options = {
      httpOnly: true,
      // secure: process.env.NODE_ENV === 'production',
      // sameSite: 'Strict',
      expires: new Date(Date.now() + expiryMinutes * 60 * 1000), // Default to 30 minutes
    };

    res.status(statusCode).cookie(name, value, options).json({
      success: true,
      message: `${name} cookie sent successfully`,
    });
  } catch (error) {
    console.error('Error sending cookie:', error);
    res.status(500).json({ success: false, message: 'Failed to send cookie' });
  }
};


module.exports = {
  generateJwtToken,
  sendCookie,
};
