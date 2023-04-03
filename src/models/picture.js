const { DataTypes } = require("sequelize");
const Conn = require("../configs/db");
const Item = require("./item");

const Picture = Conn.define(
	"Picture",
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
			allowNull: false,
		},
		filename: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		items_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: Item,
				key: "id",
			},
		},
	},
	{
		tableName: "pictures",
		timestamps: true,
		paranoid: true,
	}
);

module.exports = Picture;
