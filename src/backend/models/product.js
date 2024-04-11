const db = require('../database');
const tables = db.tables;

class Product {
    constructor(id, name, images, description, price) {
        this.id = id;
        this.name = name;
        this.images = images;
        this.description = description;
        this.price = price;
    }

    static async getAll() {
        return new Promise((resolve, reject) => {
            db.query(`SELECT * FROM ${tables.PRODUCT}`, (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows.map((row) => new Product(row.id, row.name, row.images, row.description, row.price)));
                }
            });
        });
    }

    static async findById(productId) {
        return new Promise((resolve, reject) => {
            db.query(`SELECT * FROM ${tables.PRODUCT} WHERE id = ?`, [productId], (err, rows) => {
                if (err || rows.length === 0) {
                    reject(err || new Error('Product not found'));
                } else {
                    const row = rows[0];
                    resolve(new Product(row.id, row.name, row.images, row.description, row.price));
                }
            });
        });
    }

    async create() {
        return new Promise((resolve, reject) => {
            db.query(
                `INSERT INTO ${tables.PRODUCT} (name, images, description, price) VALUES (?, ?, ?, ?)`,
                [this.name, this.images, this.description, this.price],
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

    async update() {
        return new Promise((resolve, reject) => {
            db.query(
                `UPDATE ${tables.PRODUCT} SET name = ?, images = ?, description = ?, price = ? WHERE id = ?`,
                [this.name, this.images, this.description, this.price, this.id],
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

    async delete() {
        return new Promise((resolve, reject) => {
            db.query(`DELETE FROM ${tables.PRODUCT} WHERE id = ?`, [this.id], (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(true);
                }
            });
        });
    }
}

module.exports = Product;
