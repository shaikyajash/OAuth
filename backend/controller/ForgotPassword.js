const User = require("../models/User");
const sendEmail = require("../utils/emailServide");

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(401).json({
        messsage: " User not found",
      });
    }

    if (!user.isVerified) {
      return res.status(401).json({
        message: "Email not verified ",
      });
    }

    const resetPasswordToken = user.generateResetToken();
    await user.save();

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetPasswordToken}`;
    const message = `<p>Click <a href="${resetUrl}">here</a> to reset your password.</p>`;

    await sendEmail({
      email: user.email,
      subject: "Password Reset Request",
      message,
    });

    return res
      .status(200)
      .json({ message: "Password reset link sent to your email." });
  } catch (error) {
    return res.status(500).json({
      message: "Error sending password reset email",
      error: error.message,
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    //updating the passsword
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpiry = undefined;
    await user.save();

    return res
      .status(200)
      .json({ message: "Password has been reset successfully." });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error in resetting password", error: error.message });
  }
};

module.exports = {
  forgotPassword,
  resetPassword,
};
