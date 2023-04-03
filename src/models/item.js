const { DataTypes } = require("sequelize");
const Conn = require("../configs/db");
const User = require("./user");

const Item = Conn.define(
	"Item",
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
			allowNull: false,
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		buy_price: {
			type: DataTypes.FLOAT,
			allowNull: false,
		},
		sell_price: {
			type: DataTypes.FLOAT,
			allowNull: false,
		},
		stock: {
			type: DataTypes.FLOAT,
			allowNull: false,
		},
		users_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: User,
				key: "id",
			},
		},
	},
	{
		tableName: "items",
		timestamps: true,
		paranoid: true,
	}
);

module.exports = Item;
