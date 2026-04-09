const db = require("../config/db");

const createTable = `
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
`;

db.query(createTable, (err) => {
    if (err) {
        console.error("Error creating users table:", err);
    } else {
        console.log("Users table ready");
    }
});

exports.createUser = (data, callback) => {
    db.query(
        "INSERT INTO users ( email, password) VALUES (?, ?)",
        [ data.email, data.password],
        callback
    );
};

exports.findByEmail = (email, callback) => {
    db.query(
        "SELECT * FROM users WHERE email = ?",
        [email],
        callback
    );
};

exports.findById = (id, callback) => {
    db.query(
        "SELECT id, email created_at FROM users WHERE id = ?",
        [id],
        callback
    );
};


