import knex from "knex";

interface User {

}

interface IUserService {
    database: knex.Knex;
    getAll(orderBy?: string, descending?: boolean, limit?: number): Promise<any[]>;
}

class UserService implements IUserService {
    database: knex.Knex;

    constructor(database: knex.Knex) {
        this.database = database;
    }

    async getAll(orderBy?: string, descending?: boolean, limit?: number) {
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

export default UserService;