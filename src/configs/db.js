const { Sequelize } = require("sequelize");
require("dotenv").config();

// const Conn = new Sequelize("nutech", "root", "", {
// 	host: "localhost",
// 	port: "3306",
// 	dialect: "mysql",
// });

const dbUri = process.env.JAWSDB_URL;
console.log(dbUri);
const Conn = new Sequelize(dbUri, {
	dialect: "mysql",
});

module.exports = Conn;
