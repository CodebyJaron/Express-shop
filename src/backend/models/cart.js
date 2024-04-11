// Order.js

const db = require('../database');
const tables = db.tables;
const Product = require('./product');
const User = require('./user');

class Order {
    constructor(id, discordId) {
        this.id = id;
        this.discordId = discordId;
        this.products = [];
    }

    static async findByUserId(discordId) {
        return new Promise((resolve, reject) => {
            db.query(`SELECT * FROM ${tables.CART} WHERE discord_id = ?`, [discordId], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    if (rows.length > 0) {
                        const cart = new Cart(rows[0].id, rows[0].discord_id);
                        resolve(cart);
                    } else {
                        resolve(null);
                    }
                }
            });
        });
    }

    async create() {
        return new Promise((resolve, reject) => {
            db.query(`INSERT INTO ${tables.ORDER} (discord_id) VALUES (?)`, [this.discordId], (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    this.id = result.insertId;
                    resolve(this);
                }
            });
        });
    }

    async addProduct(productId) {
        return new Promise((resolve, reject) => {
            db.query(
                `INSERT INTO ${tables.ORDER_ITEMS} (order_id, product_id) VALUES (?, ?)`,
                [this.id, productId],
                (err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(true);
                    }
                }
            );
        });
    }

    async removeProduct(productId) {
        return new Promise((resolve, reject) => {
            db.query(
                `DELETE FROM ${tables.ORDER_ITEMS} WHERE order_id = ? AND product_id = ?`,
                [this.id, productId],
                (err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(true);
                    }
                }
            );
        });
    }

    async getProducts() {
        return new Promise((resolve, reject) => {
            db.query(
                `SELECT * FROM ${tables.PRODUCT} WHERE id IN (SELECT product_id FROM ${tables.ORDER_ITEMS} WHERE order_id = ?)`,
                [this.id],
                (err, rows) => {
                    if (err) {
                        reject(err);
                    } else {
                        const products = rows.map(
                            (row) => new Product(row.id, row.name, row.images, row.description, row.price)
                        );
                        resolve(products);
                    }
                }
            );
        });
    }

    async getUser() {
        return User.findById(this.discordId);
    }
}

module.exports = Order;
