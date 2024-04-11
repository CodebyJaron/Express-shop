const db = require('../database');
const tables = db.tables;
const Product = require('./product');
const User = require('./user');

// order(null, discordId, [productids])
class Order {
    constructor(id, discordId, productIds) {
        this.id = id;
        this.discordId = discordId;
        this.productIds = productIds;
    }

    static async getAll() {
        return new Promise((resolve, reject) => {
            db.query(`SELECT * FROM ${tables.ORDER}`, (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows.map((row) => new Order(row.id, row.discord_id, JSON.parse(row.product_ids))));
                }
            });
        });
    }

    static async findById(orderId) {
        return new Promise((resolve, reject) => {
            db.query(`SELECT * FROM ${tables.ORDER} WHERE id = ?`, [orderId], (err, rows) => {
                if (err || rows.length === 0) {
                    reject(err || new Error('Order not found'));
                } else {
                    const row = rows[0];
                    resolve(new Order(row.id, row.discord_id, JSON.parse(row.product_ids)));
                }
            });
        });
    }

    async create() {
        return new Promise((resolve, reject) => {
            db.query(
                `INSERT INTO ${tables.ORDER} (discord_id, product_ids) VALUES (?, ?)`,
                [this.discordId, JSON.stringify(this.productIds)],
                (err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        this.id = result.insertId;
                        resolve(this);
                    }
                }
            );
        });
    }

    async delete() {
        return new Promise((resolve, reject) => {
            db.query(`DELETE FROM ${tables.ORDER} WHERE id = ?`, [this.id], (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(true);
                }
            });
        });
    }

    async getProducts() {
        const productPromises = this.productIds.map((productId) => Product.findById(productId));
        return Promise.all(productPromises);
    }

    async getUser() {
        return new Promise((resolve, reject) => {
            User.findById(this.discordId)
                .then((user) => resolve(user))
                .catch((err) => reject(err));
        });
    }

    async calculateOrderPrice() {
        try {
            const products = await this.getProducts();
            return products.reduce((acc, product) => acc + parseInt(product.price), 0);
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Order;
