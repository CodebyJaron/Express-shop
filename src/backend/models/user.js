const db = require('../database');
const table = db.tables.USER;

const Cart = require('./cart');

module.exports = class User {
    constructor(discordId, username, email, avatar, permission) {
        this.discordId = discordId;
        this.username = username;
        this.email = email;
        this.avatar = avatar;
        this.permission = permission;
    }

    static async getAll() {
        return new Promise((resolve, reject) => {
            db.query(`SELECT * FROM ${table}`, (err, rows) => {
                if (err) {
                    reject(null);
                } else {
                    resolve(
                        rows.map((row) => new User(row.discord_id, row.username, row.email, row.avatar, row.permission))
                    );
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
                    resolve(
                        new User(
                            rows[0].discord_id,
                            rows[0].username,
                            rows[0].email,
                            rows[0].avatar,
                            rows[0].permission
                        )
                    );
                }
            });
        });
    }

    async create() {
        return new Promise((resolve, reject) => {
            db.query(
                `INSERT INTO ${table} (discord_id, username, email, avatar, permission) VALUES (?, ?, ?, ?, ?)`,
                [this.discordId, this.username, this.email, this.avatar, this.permission || 0],
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

    async isAdmin() {
        return this.permission == 2;
    }

    async isStaff() {
        return this.permission == 1 || this.permission == 2;
    }

    async isGuest() {
        return this.permission == 1 && !this.permission == 2 && !this.permission == 1;
    }

    async update() {
        return new Promise((resolve, reject) => {
            db.query(
                `UPDATE ${table} SET username = ?, email = ?, avatar = ?, permission = ? WHERE discord_id = ?`,
                [this.username, this.email, this.avatar, this.permission || 0, this.discordId],
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

    static async updateOrCreate(discordId, username, email, avatar, permission) {
        return new Promise((resolve, reject) => {
            db.query(`SELECT * FROM ${table} WHERE discord_id = ?`, [discordId], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    if (rows.length > 0) {
                        const user = new User(discordId, username, email, avatar, rows[0].permission || 0);
                        user.update()
                            .then(() => resolve(user))
                            .catch(reject);
                    } else {
                        const newUser = new User(discordId, username, email, avatar, 0);
                        newUser
                            .create()
                            .then(() => resolve(newUser))
                            .catch(reject);
                    }
                }
            });
        });
    }

    async getCart() {
        try {
            const cart = await Cart.findByUserId(this.discordId);
            return cart;
        } catch (error) {
            throw error;
        }
    }
};
