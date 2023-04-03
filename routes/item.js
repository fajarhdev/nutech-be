var express = require("express");
const VerifyToken = require("../src/middlewares/verifyToken");
const {
	AddItem,
	UpdateItem,
	DeleteItem,
	GetItem,
	GetSpecificItem,
	GetAllItemSeller,
} = require("../src/controllers/item");
const multer = require("multer");
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, "./public/files");
	},
	filename: function (req, file, cb) {
		cb(null, Date.now() + "-" + file.originalname);
	},
});
const upload = multer({
	storage: storage,
	limits: {
		fileSize: 100 * 1024, // 100KB limit for each file
	},
});
var router = express.Router();

// seller
router.post("/add", VerifyToken, upload.array("files", 3), AddItem);
router.patch("/update", VerifyToken, upload.array("files", 3), UpdateItem);
router.delete("/delete", VerifyToken, DeleteItem);

// buyer
router.get("/get", VerifyToken, GetItem);

// seller
router.get("/get/seller", VerifyToken, GetAllItemSeller);

// buyer seller
router.get("/get/search", VerifyToken, GetSpecificItem);

module.exports = router;
