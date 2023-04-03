const User = require("../models/user");

const GetUser = async (req, res) => {
	const users_id = req.users_id;
	console.log(users_id);
	try {
		const getUser = await User.findOne({
			where: {
				id: users_id,
			},
		});

		if (getUser === null) {
			return res.status(404).json({ data: "User is not found" });
		}

		return res.status(200).json({ data: getUser });
	} catch (error) {
		return res.status(500).json({ data: "Failed get user data", error });
	}
};

module.exports = GetUser;
