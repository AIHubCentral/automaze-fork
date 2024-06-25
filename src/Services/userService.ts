import knex from "knex";

export interface UserModel {
    id: string,
    userName: string,
    displayName: string,
    bananas: number
}

interface IUserService {
    database: knex.Knex;
    getAll(orderBy?: string, descending?: boolean, limit?: number): Promise<UserModel[]>;
    getById(id: string): Promise<UserModel | undefined>;
    add(user: UserModel): Promise<UserModel>;
    update(id: string, data: any): Promise<boolean>;
    incrementBananaCount(id: string): Promise<UserModel | undefined>;
}

class UserService implements IUserService {
    database: knex.Knex;

    constructor(database: knex.Knex) {
        this.database = database;
    }

    async getById(id: string): Promise<UserModel | undefined> {
        let query = this.database('user');
        const result = await query.where('id', id).first();
        if (!result) return;
        const foundUser: UserModel = {
            id: result.id, userName: result.username,
            displayName: result.display_name, bananas: result.bananas
        };
        return foundUser;
    }

    async getAll(orderBy?: string, descending?: boolean, limit?: number): Promise<UserModel[]> {
        let query = this.database('user');

        if (orderBy) {
            query = query.orderBy(orderBy, descending ? 'desc' : 'asc');
        }

        if (limit) {
            query = query.limit(limit);
        }

        const result = await query.select('*');

        const users: UserModel[] = [];

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

    async add(user: UserModel): Promise<UserModel> {
        const userDb = this.database('user');
        await userDb.insert(user);
        return user;
    }

    async update(userId: string, data: any): Promise<boolean> {
        const userDb = this.database('user');
        try {
            await userDb.update(data).where({ id: userId });
            return true;
        } catch (error) {
            return false;
        }
    }

    async incrementBananaCount(userId: string): Promise<UserModel | undefined> {
        await this.database('user').where('id', userId).increment('bananas', 1);
        const updatedUser = await this.getById(userId);
        return updatedUser;
    }

}

export default UserService;