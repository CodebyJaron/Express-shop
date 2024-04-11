const mysql = require('mysql2');
const config = require('../../config.json');

const connection = mysql.createConnection({
    host: config.mysql.host,
    user: config.mysql.user,
    password: config.mysql.password,
    database: config.mysql.database,
});

const tables = {
    USER: 'user',
    PRODUCT: 'product',
    CART: 'cart',
    ORDER: 'order',
};

const queries = [
    `CREATE TABLE IF NOT EXISTS \`${tables.USER}\` (
        discord_id VARCHAR(255) PRIMARY KEY,
        username VARCHAR(255),
        email VARCHAR(255),
        avatar VARCHAR(255),
        blacklist BOOLEAN
    )`,
    `CREATE TABLE IF NOT EXISTS \`${tables.PRODUCT}\` (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255),
        images VARCHAR(255),
        description VARCHAR(255),
        price VARCHAR(255)
    )`,
    `CREATE TABLE IF NOT EXISTS \`${tables.CART}\` (
        id INT AUTO_INCREMENT PRIMARY KEY,
        discord_id VARCHAR(255),
        product_id INT,
        FOREIGN KEY (discord_id) REFERENCES \`${tables.USER}\`(discord_id),
        FOREIGN KEY (product_id) REFERENCES \`${tables.PRODUCT}\`(id)
    )`,
    `CREATE TABLE IF NOT EXISTS \`${tables.ORDER}\` (
        id INT AUTO_INCREMENT PRIMARY KEY,
        discord_id VARCHAR(255),
        product_id INT,
        FOREIGN KEY (discord_id) REFERENCES \`${tables.USER}\`(discord_id),
        FOREIGN KEY (product_id) REFERENCES \`${tables.PRODUCT}\`(id)
    )`,
];

queries.forEach((query) => {
    connection.query(query, (err, results) => {
        if (err) {
            console.log(err);
        } else {
            console.log(`Database | ${query.split(' ')[5]} table is created!`);
        }
    });
});

module.exports = connection;
module.exports.tables = tables;
