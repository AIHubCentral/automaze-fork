"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class UserService {
    constructor(database) {
        this.database = database;
    }
    async getAll(orderBy, descending, limit) {
        let query = this.database('user');
        if (orderBy) {
            query = query.orderBy(orderBy, descending ? 'desc' : 'asc');
        }
        if (limit) {
            query = query.limit(limit);
        }
        const result = await query.select('*');
        const users = [];
        for (const item of result) {
            users.push(item);
        }
        return users;
    }
}
exports.default = UserService;
