const { DB_HOST, DB_USERNAME, DB_PASSWORD, DB_NAME } = process.env;
const sql = require('mysql2');

const db = sql.createConnection({
    host: DB_HOST,
    user: DB_USERNAME,
    password: DB_PASSWORD,
    database: DB_NAME,
});

db.connect((err) => {
    if (err) {
        console.error('🤬 Database connection failed:', err);
        return;
    }
    console.log('Connected to the database successfully 👍');
});

module.exports = db;
