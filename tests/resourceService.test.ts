import Knex from 'knex';
import knexConfig from '../src/Database/knexfile';
import ResourceService, { IResource } from '../src/Services/resourceService';

const knex = Knex(knexConfig.test);

const service = new ResourceService(knex);

describe('Resource Service', () => {
    beforeAll(async () => {
        await knex.migrate.latest();
    });

    afterAll(async () => {
        await knex.destroy();
    });

    describe('CRUD operations', () => {
        it('should create resources', async () => {
            let sampleData: Partial<IResource> = {};

            sampleData = {
                category: 'kaggle',
                url: 'https://www.kaggle.com/',
            };

            let id = await service.create(sampleData);
            expect(id).toBe(1);

            sampleData = {
                id: 2,
                category: 'colab',
                url: 'https://colab.research.google.com/',
                displayTitle: 'Colab Notebook',
                emoji: 'none',
                authors: 'Kazuya, Jinpachi and Jin',
            };

            id = await service.create(sampleData);
            expect(id).toBe(2);

            sampleData = {
                category: 'colab',
                url: 'https://colab.research.google.com/',
                displayTitle: 'Fixed Colab',
                authors: 'Hwoarang',
            };

            id = await service.create(sampleData);
            expect(id).toBe(3);

            sampleData = {
                category: 'colab',
                url: 'https://colab.research.google.com/',
                displayTitle: 'My Colab',
                authors: 'Xiaoyu',
            };

            id = await service.create(sampleData);
            expect(id).toBe(4);
        });

        it('should read resources', async () => {
            // Single resources
            let fetchedResource = await service.find(1);
            expect(fetchedResource).toBeDefined();
            expect(fetchedResource).toHaveProperty('id', 1);
            expect(fetchedResource).toHaveProperty('category', 'kaggle');
            expect(fetchedResource).toHaveProperty('url', 'https://www.kaggle.com/');
            expect(fetchedResource).toHaveProperty('displayTitle', null);
            expect(fetchedResource).toHaveProperty('emoji', null);
            expect(fetchedResource).toHaveProperty('authors', null);

            fetchedResource = await service.find(2);
            expect(fetchedResource).toBeDefined();
            expect(fetchedResource).toHaveProperty('id', 2);
            expect(fetchedResource).toHaveProperty('category', 'colab');
            expect(fetchedResource).toHaveProperty('url', 'https://colab.research.google.com/');
            expect(fetchedResource).toHaveProperty('displayTitle', 'Colab Notebook');
            expect(fetchedResource).toHaveProperty('emoji', 'none');
            expect(fetchedResource).toHaveProperty('authors', 'Kazuya, Jinpachi and Jin');

            // all resources
            const allResources = await service.findAll();
            expect(allResources.data).toHaveLength(4);
            expect(allResources.hasNext).toBe(false);

            // filtered resources
            const filteredResources = await service.findAll({
                limit: 2,
                filter: { column: 'category', value: 'colab' },
            });
            expect(filteredResources.hasNext).toBe(true);
            expect(filteredResources.data).toHaveLength(2);
            expect(filteredResources.data[0]).toHaveProperty('category', 'colab');
            expect(filteredResources.data[1]).toHaveProperty('category', 'colab');
        });

        it('should update resources', async () => {
            const affectedRows = await service.update(4, {
                displayTitle: 'My Awesome Colab',
                emoji: ':nails:',
            });
            expect(affectedRows).toBe(1);

            const fetchedResource = await service.find(4);
            expect(fetchedResource).toBeDefined();
            expect(fetchedResource).toHaveProperty('id', 4);
            expect(fetchedResource).toHaveProperty('category', 'colab');
            expect(fetchedResource).toHaveProperty('url', 'https://colab.research.google.com/');
            expect(fetchedResource).toHaveProperty('displayTitle', 'My Awesome Colab');
            expect(fetchedResource).toHaveProperty('emoji', ':nails:');
            expect(fetchedResource).toHaveProperty('authors', 'Xiaoyu');
        });

        it('should delete resources', async () => {
            const affectedRows = await service.delete(1);
            expect(affectedRows).toBe(1);

            // resource should no longer exist
            const fetchedResource = await service.find(1);
            expect(fetchedResource).toBeUndefined();

            // clear all resources
            await service.clearAll();
            const allResources = await service.findAll();
            expect(allResources.hasNext).toBe(false);
            expect(allResources.data).toHaveLength(0);
        });
    });
});
