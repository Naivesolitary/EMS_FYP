const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: 'localhost',
    user:'root',
    password:'root@2081',
    database:'evenera_db',
    connectionLimit:10,
    queueLimit:5,
    waitForConnections:true
})

module.exports = pool