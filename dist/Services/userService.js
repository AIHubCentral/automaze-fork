"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = createUser;
exports.getUser = getUser;
exports.getAllUsers = getAllUsers;
exports.updateUser = updateUser;
exports.deleteUser = deleteUser;
exports.deleteAllUsers = deleteAllUsers;
exports.incrementBananaCount = incrementBananaCount;
async function createUser(knexInstance, userData) {
    const [id] = await knexInstance('users').insert(userData).returning('id');
    return id;
}
async function getUser(knexInstance, id) {
    const users = await knexInstance('users').where({ id }).first();
    if (users) {
        const userData = users;
        return userData;
    }
    return null;
}
async function getAllUsers(knexInstance, limit, sortBy, order = 'asc') {
    const query = knexInstance('users').select('*');
    if (sortBy) {
        query.orderBy(sortBy, order);
    }
    if (limit) {
        query.limit(limit);
    }
    return await query;
}
async function updateUser(knexInstance, id, userData) {
    await knexInstance('users').where({ id }).update(userData);
    return getUser(knexInstance, id); // Return updated user data
}
async function deleteUser(knexInstance, id) {
    await knexInstance('users').where({ id }).del();
}
async function deleteAllUsers(knexInstance) {
    await knexInstance('users').del();
}
async function incrementBananaCount(knexInstance, userId) {
    await knexInstance('user').where('id', userId).increment('bananas', 1);
    const updatedUser = await getUser(knexInstance, userId);
    return updatedUser;
}
