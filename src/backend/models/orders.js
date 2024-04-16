const db = require('../database');
const tables = db.tables;

class Order {
    constructor(id, discordId, date) {
        this.id = id;
        this.discordId = discordId;
        this.date = date;
        this.products = [];
    }

    static async getAll() {
        return new Promise((resolve, reject) => {
            db.query(`SELECT * FROM ${tables.ORDER}`, (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows.map((row) => new Order(row.id, row.discord_id, row.date)));
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
                    resolve(new Order(row.id, row.discord_id, row.date));
                }
            });
        });
    }

    static async findByUserId(userId) {
        return new Promise((resolve, reject) => {
            db.query(`SELECT * FROM ${tables.ORDER} WHERE discord_id = ?`, [userId], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows.map((row) => new Order(row.id, row.discord_id, row.date)));
                }
            });
        });
    }
    static async getAllInLast24Hours() {
        return new Promise((resolve, reject) => {
            db.query(`SELECT * FROM \`${tables.ORDER}\` WHERE date >= DATE_SUB(NOW(), INTERVAL 1 DAY)`, (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows.map((row) => new Order(row.id, row.discord_id, row.date)));
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
        return new Promise((resolve, reject) => {
            db.query(
                `SELECT product_id FROM ${tables.ORDER_PRODUCTS} WHERE order_id = ?`,
                [this.id],
                async (err, rows) => {
                    if (err) {
                        reject(err);
                    } else {
                        const productIds = rows.map((row) => row.product_id);
                        const products = await Promise.all(productIds.map((productId) => Product.findById(productId)));
                        resolve(products);
                    }
                }
            );
        });
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
