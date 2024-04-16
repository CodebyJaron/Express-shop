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
    CART_ITEMS: 'cart_items',
    ORDER_PRODUCTS: 'order_products',
};

const createTable = (query) => {
    return new Promise((resolve, reject) => {
        connection.query(query, (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
};

const createTablesSequentially = async () => {
    try {
        await createTable(`CREATE TABLE IF NOT EXISTS \`${tables.USER}\` (
            discord_id VARCHAR(255) PRIMARY KEY,
            username VARCHAR(255),
            email VARCHAR(255),
            avatar VARCHAR(255),
            blacklist BOOLEAN DEFAULT FALSE,
            permission INT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`);

        await createTable(`CREATE TABLE IF NOT EXISTS \`${tables.PRODUCT}\` (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255),
            images VARCHAR(255),
            description VARCHAR(255),
            price VARCHAR(255)
        )`);

        await createTable(`CREATE TABLE IF NOT EXISTS ${tables.CART} (
            id INT AUTO_INCREMENT PRIMARY KEY,
            discord_id VARCHAR(255) UNIQUE,
            FOREIGN KEY (discord_id) REFERENCES ${tables.USER}(discord_id)
        )`);

        await createTable(`CREATE TABLE IF NOT EXISTS ${tables.CART_ITEMS} (
            id INT AUTO_INCREMENT PRIMARY KEY,
            cart_id INT,
            product_id INT,
            FOREIGN KEY (cart_id) REFERENCES ${tables.CART}(id),
            FOREIGN KEY (product_id) REFERENCES ${tables.PRODUCT}(id)
        )`);

        await createTable(`CREATE TABLE IF NOT EXISTS \`${tables.ORDER}\` (
            id INT AUTO_INCREMENT PRIMARY KEY,
            discord_id VARCHAR(255),
            date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (discord_id) REFERENCES \`${tables.USER}\`(discord_id)
        )`);

        await createTable(`CREATE TABLE IF NOT EXISTS \`${tables.ORDER_PRODUCTS}\` (
            id INT AUTO_INCREMENT PRIMARY KEY,
            order_id INT,
            FOREIGN KEY (order_id) REFERENCES \`${tables.ORDER}\`(id),
            product_id INT,
            FOREIGN KEY (product_id) REFERENCES \`${tables.PRODUCT}\`(id)
        )`);

        console.log('All tables are created successfully.');
    } catch (error) {
        console.error('Error creating tables:', error);
    }
};

createTablesSequentially();

module.exports = connection;
module.exports.tables = tables;
