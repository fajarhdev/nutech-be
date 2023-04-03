const { Sequelize } = require("sequelize");

const Conn = new Sequelize("nutech", "root", "", {
	host: "localhost",
	port: "3306",
	dialect: "mysql",
});

module.exports = Conn;
