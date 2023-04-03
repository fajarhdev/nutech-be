const Conn = require("../configs/db");
const Item = require("../models/item");
const Picture = require("../models/picture");
const User = require("../models/user");

const Sync = () => {
	User.sync();
	Item.sync();
	Picture.sync();
};

const Assoc = () => {
	User.hasMany(Item, {
		foreignKey: "users_id",
	});
	Item.belongsTo(User, {
		foreignKey: "users_id",
	});

	Item.hasMany(Picture, {
		foreignKey: "items_id",
	});
	Picture.hasMany(Item, {
		foreignKey: "items_id",
	});
};

try {
	Conn.authenticate();
	console.log("Connection has been established successfully.");
	Sync();
	Assoc();
} catch (error) {
	console.error("Unable to connect to the database:", error);
}
