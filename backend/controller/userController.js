const User = require("../models/User");
const handleUserDetails = async (req, res) => {
  try {


    res.status(200).json({
      msg: "User details fetched successfully",
      status: "T",
      data: req.user,
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
