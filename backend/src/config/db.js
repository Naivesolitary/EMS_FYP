const mysql = require('mysql2/promise');
require('dotenv').config

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    connectionLimit:parseInt(process.env.DB_CONNECTION),
    queueLimit:parseInt(process.env.DB_QUEUE_LIMIT),
    waitForConnections:process.env.DB_WAIT_FOR_CONNECTIONS === 'true'
})

module.exports = pool