const db = require('../database');
const tables = db.tables;

class Product {
    constructor(id, name, images, description, price, categoryId) {
        this.id = id;
        this.name = name;
        this.images = images;
        this.description = description;
        this.price = price;
        this.categoryId = categoryId;
    }

    async addImage(imageUrl) {
        this.images.push(imageUrl);
        await this.updateImages();
    }

    async removeImage(imageUrl) {
        const index = this.images.indexOf(imageUrl);
        if (index !== -1) {
            this.images.splice(index, 1);
            await this.updateImages();
        }
    }

    static async getAll() {
        return new Promise((resolve, reject) => {
            db.query(`SELECT * FROM ${tables.PRODUCT}`, (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(
                        rows.map(
                            (row) =>
                                new Product(row.id, row.name, row.images, row.description, row.price, row.category_id)
                        )
                    );
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
                    resolve(new Product(row.id, row.name, row.images, row.description, row.price, row.category_id));
                }
            });
        });
    }

    async create() {
        return new Promise((resolve, reject) => {
            db.query(
                `INSERT INTO ${tables.PRODUCT} (name, images, description, price, category_id) VALUES (?, ?, ?, ?, ?)`,
                [this.name, JSON.stringify(this.images), this.description, this.price, this.categoryId],
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
                `UPDATE ${tables.PRODUCT} SET name = ?, images = ?, description = ?, price = ?, category_id = ? WHERE id = ?`,
                [this.name, JSON.stringify(this.images), this.description, this.price, this.categoryId, this.id],
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

    static async findByCategoryId(categoryId) {
        return new Promise((resolve, reject) => {
            db.query(`SELECT * FROM ${tables.PRODUCT} WHERE category_id = ?`, [categoryId], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows.map((row) => new Product(row.id, row.name, row.images, row.description, row.price)));
                }
            });
        });
    }

    async updateImages() {
        return new Promise((resolve, reject) => {
            db.query(
                `UPDATE ${tables.PRODUCT} SET images = ? WHERE id = ?`,
                [JSON.stringify(this.images), this.id],
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
}

module.exports = Product;
