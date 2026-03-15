const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'au_roadmap',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Test connection
pool.getConnection()
  .then((connection) => {
    console.log('MySQL connected successfully');
    connection.release();
  })
  .catch((err) => {
    console.error('MySQL connection failed:', err.message);
  });

module.exports = pool;
