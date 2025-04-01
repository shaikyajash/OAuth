const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { OAuth2Client } = require("google-auth-library");
const crypto = require("crypto");

const sendEmail = require("../utils/emailServide");
const { generateJwtToken, sendCookie } = require("../utils/Reuseable");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Register Controller

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    // Check if user exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create user
    user = await User.create({
      name,
      email,
      password,
    });

    // Generating verification token
    const verifyToken = user.generateToken();
    await user.save();
    // Send verification email
    const verificationUrl = `http://${process.env.FRONTEND_URL}/verify-email/${verifyToken}`;

    const message = `
    <p>Please verify your email by clicking the button below:</p>
      <a href="${verificationUrl}" 
       style="display: inline-block; background-color: #007bff; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
      Verify Your Email
      </a>
        `;

    await sendEmail({
      email: user.email,
      subject: `Email Verification`,
      message,
    });

    // sendToken(user, 201, res);
    res.status(201).json({
      message:
        "Registration successful! Please check your email to verify your account.",
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error in registration", error: error.message });
  }
};

//Google Signup Controller
const googleAuth = async (req, res) => {
  try {
    const { idtoken } = req.body;
    if (!idtoken) {
      return res.status(400).json({ message: "Google token not found" });
    }

    // Verify the Google token
    const ticket = await client.verifyIdToken({
      idToken: idtoken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const { name, email, picture, sub: googleId } = ticket.getPayload();

    if (!email) {
      return res
        .status(400)
        .json({ message: "Email not found in Google account" });
    }

    // Check if the user already exists
    let user = await User.findOne({ email });
    //Making a temporary password for google users
    const tempPassword = crypto.randomBytes(6).toString("hex");



    if (user) {
      // User exists - check if they have Google ID linked
      if (!user.googleId) {
        // If no Google ID, associate the Google account
        user.googleId = googleId;
        user.picture = picture;
        await user.save();
      }
    } else {
      // If user doesn't exist, create a new one using Google credentials
      user = await User.create({
        name,
        email,
        googleId,
        picture,
        password: tempPassword,
      });
    }

    //Generating token
    const payload = {
      id: user._id,
      name: user.name,
      email: user.email,
      picture: user.picture,
    };
    const token = generateJwtToken(payload); 
    //Setting cookies
    sendCookie(res, "token", token, 200, 30);


    
  } catch (error) {
    console.error("Error in Google Signup/Login:", error.message);
    return res
      .status(500)
      .json({ message: "Error in Google Signup/Login", error: error.message });
  }
};

// Login Controller

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    //Finding the user by email
    const user = await User.findOne({ email });
    //Checking if the user exists
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Check if the user has verified their email
    if (!user.isVerified) {
      // If not verified, send a verification email again
      const verifyToken = user.generateToken();
      await user.save();
      const verificationUrl = `http://${process.env.FRONTEND_URL}/verify-email/${verifyToken}`;
      const message = `<p>You tried to log in without verifying your email. Please verify your email by clicking <a href="${verificationUrl}">here</a>.</p>`;

      await sendEmail({
        email: user.email,
        subject: "Verify Your Email",
        message,
      });

      return res.status(403).json({
        message:
          "Please verify your email. A new verification link has been sent to your email.",
      });
    }

    //Checking password using the function I created in User.js
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    //Generating token

    const payload = {
      id: user._id,
      name: user.name,
      email: user.email,
      picture: user.picture,
    };
    const token = generateJwtToken(payload); 

    //Setting cookies
    return sendCookie(res, "token", token, 200, 30); // 30 minutes expiry
  } catch (error) {
    console.error("Error in login:", error.message);
    return res
      .status(500)
      .json({ message: "Error in login", error: error.message });
  }
};

module.exports = { register, login, googleAuth };
