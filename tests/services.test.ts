import Knex from 'knex';
import knexConfig from '../src/Database/knexfile';
import {
    createUser,
    deleteAllUsers,
    deleteUser,
    getAllUsers,
    getUser,
    updateUser,
    UserDTO,
} from '../src/Services/userService';

const knex = Knex(knexConfig.test);

beforeAll(async () => {
    await knex.migrate.latest();
});

beforeEach(async () => {
    await knex.seed.run();
});

afterAll(async () => {
    await knex.destroy();
});

describe('User Service CRUD Operations', () => {
    const userData: UserDTO = {
        id: '0123456789',
        username: 'testuser01',
        display_name: 'TestUser01',
    };

    it('should create a new user', async () => {
        const newUser = await createUser(knex, userData);
        expect(newUser).toHaveProperty('id');
        expect(newUser.id).toEqual(userData.id);
    });

    it('should read an existing user', async () => {
        const user = await getUser(knex, userData.id);

        expect(user).toHaveProperty('id');
        expect(user).toHaveProperty('username');
        expect(user).toHaveProperty('display_name');
        expect(user).toHaveProperty('bananas');

        expect(user!.username).toEqual(userData.username);
        expect(user!.display_name).toEqual(userData.display_name);
        expect(user!.bananas).toEqual(0);
    });

    it('should handle non existing user', async () => {
        const user = await getUser(knex, '0000000000');
        expect(user).toBeNull();
    });

    it('should update an existing user', async () => {
        const updatedData = { display_name: 'Dummy' };
        const updatedUser = await updateUser(knex, userData.id, updatedData);

        expect(updatedUser?.display_name).toEqual(updatedData.display_name);

        // shouldn't affect previous values
        expect(updatedUser!.username).toEqual(userData.username);
        expect(updatedUser!.bananas).toEqual(0);
    });

    it('should delete an existing user', async () => {
        await deleteUser(knex, userData.id);
        const user = await getUser(knex, userData.id);
        expect(user).toBeNull(); // User should no longer exist
    });

    it('should delete all users', async () => {
        const users: UserDTO[] = [
            {
                id: '1111111111111',
                username: 'user01',
                display_name: 'User 01',
                bananas: 0,
            },
            {
                id: '2222222222222',
                username: 'user02',
                display_name: 'User 02',
                bananas: 0,
            },
        ];

        await Promise.all(users.map((currentUser) => createUser(knex, currentUser)));
        await deleteAllUsers(knex);

        const allUsers = await getAllUsers(knex);

        expect(allUsers).toEqual([]);
    });

    it('should return multiple users', async () => {
        await deleteAllUsers(knex);

        const users: UserDTO[] = [
            {
                id: '11111111',
                username: 'test_01',
                display_name: 'Test 01',
            },
            {
                id: '2222222',
                username: 'test_02',
                display_name: 'Test 02',
            },
            {
                id: '33333333',
                username: 'test_03',
                display_name: 'Test 03',
            },
        ];

        await Promise.all(users.map((currentUser) => createUser(knex, currentUser)));

        let fetchedUsers = await getAllUsers(knex);

        expect(fetchedUsers.length).toBe(3);

        // limiting to 1 row
        const limit = 1;
        fetchedUsers = await getAllUsers(knex, limit);
        expect(fetchedUsers.length).toBe(limit);
    });
});
