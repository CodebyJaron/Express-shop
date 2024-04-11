const db = require('../database');
const table = db.tables.USER;

module.exports = class User {
    constructor(discordId, username, email) {
        this.discordId = discordId;
        this.username = username;
        this.email = email;
    }

    static async getAll() {
        return new Promise((resolve, reject) => {
            db.query(`SELECT * FROM ${table}`, (err, rows) => {
                if (err) {
                    reject(null);
                } else {
                    resolve(rows.map((row) => new User(row.discord_id, row.username, row.email)));
                }
            });
        });
    }

    static async findById(discordId) {
        return new Promise((resolve, reject) => {
            db.query(`SELECT * FROM ${table} WHERE discord_id =?`, [discordId], (err, rows) => {
                if (err) {
                    reject(null);
                } else {
                    resolve(new User(rows[0].discord_id, rows[0].username, rows[0].email));
                }
            });
        });
    }

    async create() {
        return new Promise((resolve, reject) => {
            db.query(
                `INSERT INTO ${table} (discord_id, username, email) VALUES (?, ?, ?)`,
                [this.discordId, this.username, this.email],
                (err, result) => {
                    if (err) {
                        reject(null);
                    } else {
                        resolve(this);
                    }
                }
            );
        });
    }

    async update() {
        return new Promise((resolve, reject) => {
            db.query(
                `UPDATE ${table} SET username = ?, email = ? WHERE discord_id = ?`,
                [this.username, this.email, this.discordId],
                (err, result) => {
                    if (err) {
                        reject(false);
                    } else {
                        resolve(true);
                    }
                }
            );
        });
    }

    async delete() {
        return new Promise((resolve, reject) => {
            db.query(`DELETE FROM ${table} WHERE discord_id = ?`, [this.discordId], (err, result) => {
                if (err) {
                    reject(false);
                } else {
                    resolve(true);
                }
            });
        });
    }

    static async updateOrCreate(discordId, username, email) {
        return new Promise((resolve, reject) => {
            db.query(`SELECT * FROM ${table} WHERE discord_id = ?`, [discordId], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    if (rows.length > 0) {
                        const user = new User(rows[0].discord_id, username, email);
                        user.update()
                            .then(() => resolve(user))
                            .catch(reject);
                    } else {
                        const newUser = new User(discordId, username, email);
                        newUser
                            .create()
                            .then(() => resolve(newUser))
                            .catch(reject);
                    }
                }
            });
        });
    }
};
