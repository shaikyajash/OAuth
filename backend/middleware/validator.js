const validateRegister = (req, res, next) => {
    const { email, password, name } = req.body;

    const errors = [];

    if (!name || name.trim().length < 2) {
        errors.push('Name must be at least 2 characters long');
    }

    if (!email || !email.match(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/)) {
        errors.push('Please provide a valid email');
    }

    if (!password || password.length < 6) {
        errors.push('Password must be at least 6 characters long');
    }

    if (errors.length > 0) {
        return res.status(400).json({ message: errors });
    }

    next();
};

const validateLogin = (req, res, next) => {
    const { email, password } = req.body;

    const errors = [];

    if (!email || !email.match(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/)) {
        errors.push('Please provide a valid email');
    }

    if (!password) {
        errors.push('Password is required');
    }

    if (errors.length > 0) {
        return res.status(400).json({ message: errors });
    }

    next();
};
const validatePasswordReset = (req, res, next) => {
    const { password } = req.body;
  
    const errors = [];
  
    // Check if password exists
    if (!password) {
      errors.push('Password is required');
    } else {
      // Validate password length
      if (password.length < 6) {
        errors.push('Password must be at least 6 characters long');
      }
  
      // Optional: Add more checks for stronger passwords
      if (!/[A-Z]/.test(password)) {
        errors.push('Password must contain at least one uppercase letter');
      }
      if (!/[a-z]/.test(password)) {
        errors.push('Password must contain at least one lowercase letter');
      }
      if (!/\d/.test(password)) {
        errors.push('Password must contain at least one number');
      }
      if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        errors.push('Password must contain at least one special character');
      }
    }
  
    if (errors.length > 0) {
      return res.status(400).json({ message: errors });
    }
  
    next();
  };
  


module.exports = { validateRegister, validateLogin, validatePasswordReset };