import Knex from 'knex';

// TODO: swap UserModel and UserDTO field names

export interface UserModel {
    id: string;
    userName: string;
    displayName: string;
    bananas: number;
}

export interface UserDTO {
    id: string;
    username: string;
    display_name: string;
    bananas?: number;
}

export async function createUser(knexInstance: Knex.Knex, userData: UserDTO) {
    const [id] = await knexInstance('users').insert(userData).returning('id');
    return id;
}

export async function getUser(knexInstance: Knex.Knex, id: string) {
    const users = await knexInstance('users').where({ id }).first();

    if (users) {
        const userData = users as UserDTO;
        return userData;
    }

    return null;
}

export async function getAllUsers(
    knexInstance: Knex.Knex,
    limit?: number,
    sortBy?: string,
    order: 'asc' | 'desc' = 'asc'
): Promise<UserDTO[]> {
    const query = knexInstance('users').select('*');

    if (sortBy) {
        query.orderBy(sortBy, order);
    }

    if (limit) {
        query.limit(limit);
    }

    return await query;
}

export async function updateUser(knexInstance: Knex.Knex, id: string, userData: Partial<UserDTO>) {
    await knexInstance('users').where({ id }).update(userData);
    return getUser(knexInstance, id); // Return updated user data
}

export async function deleteUser(knexInstance: Knex.Knex, id: string) {
    await knexInstance('users').where({ id }).del();
}

export async function deleteAllUsers(knexInstance: Knex.Knex) {
    await knexInstance('users').del();
}

export async function incrementBananaCount(knexInstance: Knex.Knex, userId: string) {
    await knexInstance('user').where('id', userId).increment('bananas', 1);
    const updatedUser = await getUser(knexInstance, userId);
    return updatedUser;
}
