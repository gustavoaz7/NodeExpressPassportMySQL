const mysql = require("mysql")
const dbconfig = require("../config/database")

const connection = mysql.createConnection(dbconfig.connection);

connection.query('CREATE DATABASE ' + dbconfig.database);

connection.query(`
CREATE TABLE ${dbconfig.database}.${dbconfig.regist_table} (
    id INT UNIQUE NOT NULL AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(50) NOT NULL
)
`);

console.log("Database created successfully!")

connection.end();