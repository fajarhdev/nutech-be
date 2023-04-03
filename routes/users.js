var express = require("express");
const GetUser = require("../src/controllers/user");
const VerifyToken = require("../src/middlewares/verifyToken");
var router = express.Router();

router.get("/get", VerifyToken, GetUser);

module.exports = router;
