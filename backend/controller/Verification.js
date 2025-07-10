const User = require("../models/User"); // Adjust the path as necessary

const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiry = undefined;
    await user.save();

    res.status(200).json({ message: "Email verified successfully!" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error verifying email", error: error.message });
  }
};

const resendVerificationEmail = async (req, res)=>{
  try{
    const {email} = req.body;
    const user  = await User.findOne({email});
    if(!user){
      return res.status(404).json({message: "User not found"});
    }

    if(user.isVerified){
      return res.status(400).json({message: "Email already verified"});
    }

    // generating  a new token
    const verifyToken = user.generateToken();
    await user.save();

    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${verifyToken}`;

    const message = `
      <p>Please verify your email by clicking the button below:</p>
      <a href="${verificationUrl}" 
        style="display: inline-block; background-color: #007bff; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
        Verify Your Email
      </a>
    `;

    await sendEmail({
      email: user.email,
      subject: `Email Verification - Resent`,
      message,
    });



    return res.status(200).json({
      message: "Verification email resent successfully! Please check your inbox.",
    });








  }catch (error) {
    console.error("Error in resendVerificationEmail:", error);
    res.status(500).json({ message: "Error resending verification email", error: error.message });
  }
}

module.exports = { verifyEmail , resendVerificationEmail};
