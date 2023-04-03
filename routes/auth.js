var express = require("express");
const { SignUp, Login } = require("../src/controllers/auth");
var router = express.Router();

router.post("/signup", SignUp);
router.post("/login", Login);

module.exports = router;
