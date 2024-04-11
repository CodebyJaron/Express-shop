module.exports = class Product {
    constructor(name, images, description, price) {
        this.name = name;
        this.images = images;
        this.description = description;
        this.price = price;
    }

    static async getAll() {
        return new Promise((resolve, reject) => {
            db.query('SELECT * FROM products', (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    async create() {
        return new Promise((resolve, reject) => {
            db.query(
                'INSERT INTO products (name, images, description, price) VALUES (?, ?, ?, ?)',
                [this.name, this.images, this.description, this.price],
                (err, result) => {
                    if (err) {
                        reject(null);
                    } else {
                        resolve(result.insertId);
                    }
                }
            );
        });
    }

    async update() {}

    async delete() {}
};
