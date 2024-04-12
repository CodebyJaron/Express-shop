const db = require('../database');
const tables = db.tables;
const Product = require('./product');
const User = require('./user');

class Cart {
    constructor(id, discordId) {
        this.id = id;
        this.discordId = discordId;
        this.products = [];
    }

    static async findByUserId(userId) {
        return new Promise((resolve, reject) => {
            db.query(`SELECT * FROM ${tables.CART} WHERE discord_id = ?`, [userId], (err, rows) => {
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
            db.query(`INSERT INTO ${tables.CART} (discord_id) VALUES (?)`, [this.discordId], (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    this.id = result.insertId;
                    resolve(this);
                }
            });
        });
    }

    async delete() {
        return new Promise((resolve, reject) => {
            db.query(`DELETE FROM ${tables.CART} WHERE id = ?`, [this.id], (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(true);
                }
            });
        });
    }

    async addProduct(productId) {
        return new Promise((resolve, reject) => {
            db.query(
                `INSERT INTO ${tables.CART_ITEMS} (cart_id, product_id) VALUES (?, ?)`,
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
                `DELETE FROM ${tables.CART_ITEMS} WHERE cart_id = ? AND product_id = ?`,
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
            db.query(`SELECT product_id FROM ${tables.CART_ITEMS} WHERE cart_id = ?`, [this.id], async (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    const productIds = rows.map((row) => row.product_id);
                    const products = await Promise.all(productIds.map((productId) => Product.findById(productId)));
                    resolve(products);
                }
            });
        });
    }

    async getUser() {
        return User.findById(this.discordId);
    }
}

module.exports = Cart;
