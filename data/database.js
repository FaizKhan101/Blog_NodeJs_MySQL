const mysql = require('mysql2/promise')

const pool = mysql.createPool({
    host: 'localhost',
    database: 'Blog_2',
    user: 'root',
    password: 'Test@123'
});

module.exports = pool;