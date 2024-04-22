const db = require('../database');
const tables = db.tables;

class Category {
    constructor(id, name) {
        this.id = id;
        this.name = name;
    }

    static async getAll() {
        return new Promise((resolve, reject) => {
            db.query(`SELECT * FROM ${tables.CATEGORY}`, (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows.map((row) => new Category(row.id, row.name)));
                }
            });
        });
    }

    static async findById(categoryId) {
        return new Promise((resolve, reject) => {
            db.query(`SELECT * FROM ${tables.CATEGORY} WHERE id = ?`, [categoryId], (err, rows) => {
                if (err || rows.length === 0) {
                    reject(err || new Error('Category not found'));
                } else {
                    const row = rows[0];
                    resolve(new Category(row.id, row.name));
                }
            });
        });
    }

    async create() {
        return new Promise((resolve, reject) => {
            db.query(`INSERT INTO ${tables.CATEGORY} (name) VALUES (?)`, [this.name], (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    this.id = result.insertId;
                    resolve(this);
                }
            });
        });
    }

    async update() {
        return new Promise((resolve, reject) => {
            db.query(`UPDATE ${tables.CATEGORY} SET name = ? WHERE id = ?`, [this.name, this.id], (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(true);
                }
            });
        });
    }

    async delete() {
        return new Promise((resolve, reject) => {
            db.query(`DELETE FROM ${tables.CATEGORY} WHERE id = ?`, [this.id], (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(true);
                }
            });
        });
    }
}

module.exports = Category;
