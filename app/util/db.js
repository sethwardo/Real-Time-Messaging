import mysql from 'mysql';
import dbConfig from "./db_config.js";

class SqlDb {
	constructor() {
		this.connection = mysql.createConnection({
				  host: dbConfig.HOST,
				  user: dbConfig.USER,
				  password: dbConfig.PASSWORD,
				  database: dbConfig.DB
		});
	}
	getConnection() {
		return this.connection;
	}
	open() {
		// open the MySQL connection
		this.connection.connect(error => {
		  if (error) throw error;
		  console.log("Successfully connected to the database.");
		});
	}
	close() {
		this.connection.end();
	}
}

export default SqlDb;