const mysql = require('mysql2');
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'orcl123456',
  database: 'payroll_db'
});

db.connect((err) => {
  if (err) throw err;
  console.log("MySQL connected.");
});

module.exports = db;
