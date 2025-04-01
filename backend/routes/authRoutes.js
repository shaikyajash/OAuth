const express = require("express");
const {
  register,
  login,
  googleAuth,
} = require("../controller/authController");
const { validateRegister, validateLogin, validatePasswordReset } = require("../middleware/validator");
const { verifyEmail } = require("../controller/Verification");
const { forgotPassword, resetPassword } = require("../controller/ForgotPassword");
const router = express.Router();

// Example Auth Routes
router.get("/", (req, res) => {
  res.json({ message: "Auth route is working!" });
});

router.post("/register", validateRegister, register);

router.post("/GoogleAuth", googleAuth );

router.post("/login", validateLogin, login);

router.get("/verify-email/:token", verifyEmail );

router.post('/forgot-password', forgotPassword);

router.post('/reset-password/:token',validatePasswordReset, resetPassword);

router.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logged out successfully" });
});
module.exports = router;
