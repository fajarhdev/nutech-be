const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const SignUp = async (req, res) => {
	const { name, birthdate, phone, email, password } = req.body;
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	const regexpass = /^.{5,}$/;
	const validateEmail = emailRegex.test(email);
	const validatePass = regexpass.test(password);

	if (validateEmail === false) {
		return res.status(400).json({ data: "Bad Request" });
	}
	if (validatePass === false) {
		return res.status(400).json({ data: "Bad Request" });
	}
	try {
		console.log("asasas");
		// find user if exist
		const findUser = await User.findOne({
			where: {
				email: email,
			},
		});
		console.log("finduser " + findUser);
		// check user if exist
		if (findUser !== null) {
			return res.status(409).json({ data: "User already exist" });
		}
		console.log("gfdsa");

		// hashing
		const hash = await bcrypt.hash(password, 10);
		console.log("sdfg");
		const createUser = await User.create({
			name: name,
			birthdate: birthdate,
			phone: phone,
			email: email,
			password: hash,
			status: "user",
		});
		console.log("qwer");

		const token = jwt.sign({ users_id: createUser.id }, process.env.SECRET_KEY, {
			expiresIn: "3h",
		});

		return res.status(200).json({ data: { msg: "Sign Up Succesful", token: token } });
	} catch (error) {
		return res.status(500).json({ data: "Cannot Signing Up", error });
	}
};

const Login = async (req, res) => {
	const { email, password } = req.body;
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	const regexpass = /^.{5,}$/;
	const validateEmail = emailRegex.test(email);
	const validatePass = regexpass.test(password);

	if (validateEmail === false) {
		res.status(400).json({ data: "Bad Request" });
	}
	if (validatePass === false) {
		res.status(400).json({ data: "Bad Request" });
	}

	try {
		// find user
		const findUser = await User.findOne({
			where: {
				email: email,
			},
		});

		// if user not exist
		if (findUser === null || findUser === undefined) {
			return res.status(404).json({ data: "User not found, May try to signup first" });
		}

		// verify password
		const verifyPass = await bcrypt.compare(password, findUser.password);

		if (verifyPass !== true) {
			return res.status(401).json({ data: "Wrong Password" });
		}

		const token = jwt.sign({ users_id: findUser.id }, process.env.SECRET_KEY, {
			expiresIn: "1h",
		});

		return res.status(200).json({ data: { msg: "Berhasil Login", token: token } });
	} catch (error) {
		return res.status(500).json({ data: "Gagal Login", error });
	}
};

module.exports = { SignUp, Login };
