const jwt = require("jsonwebtoken");


const refershTokenGenerator = (payload) => {
  try {
    const refreshToken = jwt.sign(payload, process.env.REFRESH_SECRET, {
      expiresIn: "7d",
    });

    return refreshToken;
  } catch (error) {
    console.error("Error generating refresh token:", error);
    throw new Error("Refresh token generation failed");
  }
};

const accessTokenGenerator =(payload) =>{
  try{
    const accessToken = jwt.sign(payload, process.env.ACCESS_SECRET, {
      expiresIn: "15m",
    });

    return accessToken;

  }catch(error){
    console.error("Error generating access token:", error);
    throw new Error("Access token generation failed");
  }
}

const sendCookie = (res, name, value, statusCode = 200, expiryMinutes,) => {
  try {
    const options = {
      httpOnly: true,
      secure: true,
      sameSite: "None",

      expires: new Date(Date.now() + expiryMinutes * 60 * 1000), 
    };

    res
      .status(statusCode)
      .cookie(name, value, options)
      .json({
        success: true,
        message: `${name} cookie sent successfully`,
      });
  } catch (error) {
    console.error("Error sending cookie:", error);
    res.status(500).json({ success: false, message: "Failed to send cookie" });
  }
};

module.exports = {
  sendCookie,
  refershTokenGenerator,
  accessTokenGenerator
};
