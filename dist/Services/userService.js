"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class UserService {
    constructor(database) {
        this.database = database;
    }
    async getById(id) {
        let query = this.database('user');
        const result = await query.where('id', id).first();
        if (!result)
            return;
        const foundUser = {
            id: result.id, userName: result.username,
            displayName: result.display_name, bananas: result.bananas
        };
        return foundUser;
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
            users.push({
                id: item.id,
                userName: item.username,
                displayName: item.display_name,
                bananas: item.bananas,
            });
        }
        return users;
    }
    async add(user) {
        const userDb = this.database('user');
        await userDb.insert(user);
        return user;
    }
    async update(userId, data) {
        const userDb = this.database('user');
        try {
            await userDb.update(data).where({ id: userId });
            return true;
        }
        catch (error) {
            return false;
        }
    }
    async incrementBananaCount(userId) {
        await this.database('user').where('id', userId).increment('bananas', 1);
        const updatedUser = await this.getById(userId);
        return updatedUser;
    }
}
exports.default = UserService;
