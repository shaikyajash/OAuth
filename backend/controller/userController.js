const jwt = require("jsonwebtoken");
const User = require("../models/User");


const handleUserDetails = async (req, res) => {
  try {
    // Check if user is authenticated
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Authorization token missing" });
    }

    
    const token = authHeader.split(" ")[1];
    console.log("Token at user controller:", token);
    console.log("Access secret:", process.env.ACCESS_SECRET);
    const decoded = jwt.verify(token, process.env.ACCESS_SECRET);
    
    console.log("Decoded user:", decoded);
    const user = await User.findById(decoded.id).select("-password");
        console.log("User fetched:", user);
    // const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const data  = {
       id: user._id,
        name: user.name,
        email: user.email,
        picture: user.picture || null,
    }
    


    res.status(200).json({
      msg: "User details fetched successfully",
      status: "T",
      data: data,
    });
  } catch (error) {
    res.status(500).json({
      msg: "Error fetching user details",
      status: "F",
      data: error.message,
    });
  }
};

module.exports = { handleUserDetails };
