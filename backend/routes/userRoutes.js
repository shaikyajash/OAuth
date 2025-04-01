const express = require('express');
const { handleUserDetails } = require('../controller/userController');
const { protect } = require('../middleware/auth');

const router = express.Router();





router.get("/profile", protect,handleUserDetails);



module.exports = router;