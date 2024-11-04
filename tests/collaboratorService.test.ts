import Knex from 'knex';
import knexConfig from '../src/Database/knexfile';
import CollaboratorService from '../src/Services/collaboratorService';

const knex = Knex(knexConfig.test);

const service = new CollaboratorService(knex);

describe('Collaborator Service', () => {
    beforeAll(async () => {
        await knex.migrate.latest();
    });

    beforeEach(async () => {
        const sampleData = {
            id: '0123456789',
            username: 'test01',
            displayName: 'Test 01',
        };

        await service.create(sampleData);
    });

    afterEach(async () => {
        await knex('collaborators').del();
    });

    afterAll(async () => {
        await knex.destroy();
    });

    it('should create a collaborator', async () => {
        const sampleData2 = {
            id: '09876543210',
            username: 'test02',
            displayName: 'Test 02',
        };
        const id = await service.create(sampleData2);
        expect(id).toBe(sampleData2.id);
    });

    it('should find a collaborator by id', async () => {
        let collaborator = await service.find('0123456789');

        expect(collaborator).toHaveProperty('id', '0123456789');
        expect(collaborator).toHaveProperty('username', 'test01');
        expect(collaborator).toHaveProperty('displayName', 'Test 01');

        collaborator = await service.find('000000000');
        expect(collaborator).toBeUndefined();
    });

    it('should update a collaborator', async () => {
        const affectedRows = await service.update('0123456789', { displayName: 'Kazuya Mishima' });
        expect(affectedRows).toBe(1);

        const collaborator = await service.find('0123456789');
        expect(collaborator).toHaveProperty('id', '0123456789');
        expect(collaborator).toHaveProperty('username', 'test01');
        expect(collaborator).toHaveProperty('displayName', 'Kazuya Mishima');
    });

    it('should delete a collaborator', async () => {
        const affectedRows = await service.delete('0123456789');
        expect(affectedRows).toBe(1);

        const collaborator = await service.find('0123456789');
        expect(collaborator).toBeUndefined();
    });

    it('should find all collaborators with pagination', async () => {
        await knex('collaborators').del();

        await Promise.all([
            service.create({ id: '01234', username: 'user_01' }),
            service.create({ id: '01235', username: 'user_02' }),
            service.create({ id: '01236', username: 'user_03' }),
            service.create({ id: '01237', username: 'user_04' }),
            service.create({ id: '01238', username: 'user_05' }),
        ]);

        const { data, hasNext } = await service.findAll({
            limit: 1,
            offset: 0,
            sortBy: 'id',
            sortOrder: 'asc',
        });
        expect(data.length).toBe(1);
        expect(hasNext).toBe(true);
    });
});
