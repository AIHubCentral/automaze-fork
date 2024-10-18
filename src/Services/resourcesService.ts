/* Resources: Documentation links */

import fs from 'fs/promises';
import { RESOURCES_DATABASE_PATH, resourcesDatabase } from '../Database/dbManager';
import winston from 'winston';

export interface IResource {
    id?: number;
    category: string;
    url: string;
    displayTitle?: string;
    emoji?: string;
    authors?: string;
}

export interface ICollaborator {
    discordId: string;
    username: string;
    displayName?: string;
}

export default class ResourceService {
    private logger: winston.Logger;

    constructor(logger: winston.Logger) {
        this.logger = logger;
    }

    /**
     * Initializes the resources.sqlite database schema by creating the tables
     *
     * @returns boolean Whether the database was successfully created or not
     */
    async createDatabase(): Promise<boolean> {
        try {
            await resourcesDatabase.schema.createTable('resources', (table) => {
                table.increments('id').primary();
                table.string('category').notNullable();
                table.string('url').notNullable();
                table.string('displayTitle');
                table.string('emoji');
                table.string('authors');
            });

            await resourcesDatabase.schema.createTable('collaborators', (table) => {
                table.string('discordId').primary();
                table.string('username').notNullable();
                table.string('displayName');
            });

            await resourcesDatabase.schema.createTable('settings', (table) => {
                table.increments('id').primary();
                table.string('debug_guild_id');
                table.string('debug_guild_channel_id');
                table.boolean('send_logs');
                table.boolean('send_automated_messages');
            });

            return true;
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            return false;
        }
    }

    /**
     * Drops the resources database
     * @returns boolean If the database was successfully removed
     */
    async dropDatabase(): Promise<boolean> {
        try {
            await resourcesDatabase.destroy();
            await fs.unlink(RESOURCES_DATABASE_PATH);
            return true;
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            return false;
        }
    }

    /**
     * Inserts a resource in the database
     * @param resource Object of type IResource
     * @returns The id of the inserted record
     */
    async insert(resource: IResource): Promise<number> {
        try {
            const [id] = await resourcesDatabase('resources').insert(resource);
            this.logger.info(`Resource created with ID: ${id}`);
            return id;
        } catch (error) {
            this.logger.error('Error creating resource: ', error);
            return -1;
        }
    }

    /**
     * Gets all records in the resources database
     * @returns Array of IResource
     */
    async findAll(): Promise<IResource[]> {
        const queryResult: IResource[] = await resourcesDatabase('resources').select('*');
        return queryResult;
    }

    async findById(id: number): Promise<IResource | undefined> {
        try {
            const resource = await resourcesDatabase('resources').where({ id }).first();
            this.logger.info('Resource fetched:', resource);
            return resource;
        } catch (error) {
            this.logger.error(`Error fetching resource with id ${id}`, error);
        }
    }

    async findByCategory(category: string): Promise<IResource[]> {
        try {
            const resources = await resourcesDatabase('resources').where({ category });

            if (!resources) {
                this.logger.debug(`No resource found for ${category}`);
                return [];
            }

            this.logger.debug(`${resources.length} resources fetched for ${category}`);

            return resources;
        } catch (error) {
            this.logger.error(`Error fetching resource with category ${category}`, error);
            return [];
        }
    }

    async getPaginatedResult(
        offset: number,
        recordsPerPage: number,
        filter?: { column: string; value: string }
    ) {
        this.logger.debug('Requesting paginated resources', { offset, recordsPerPage });

        let data = null;
        let counter = undefined;

        if (filter) {
            data = await resourcesDatabase('resources')
                .select('*')
                .where(filter.column, filter.value)
                .limit(recordsPerPage)
                .offset(offset);
            counter = await resourcesDatabase('resources')
                .where(filter.column, filter.value)
                .count('* as count')
                .first();
        } else {
            data = await resourcesDatabase('resources').select('*').limit(recordsPerPage).offset(offset);
            counter = await resourcesDatabase('resources').count('* as count').first();
        }
        return { data, counter };
    }

    /**
     *
     * @param id Resource ID
     * @param resource Object
     * @returns boolean Whether the operation succeeded
     */
    async update(id: number, resource: Partial<IResource>): Promise<boolean> {
        try {
            await resourcesDatabase('resources').where({ id }).update(resource);
            this.logger.info(`Resouce with id ${id} updated`);
            return true;
        } catch (error) {
            this.logger.error(`Failed updating resource with id ${id}`, error);
            return false;
        }
    }

    /**
     * Deletes a resource by its id
     * @param id of the resource
     */
    async delete(id: number): Promise<boolean> {
        try {
            await resourcesDatabase('resources').where({ id }).del();
            this.logger.info(`Deleted resource with id ${id}`);
            return true;
        } catch (error) {
            this.logger.error(`Failed to delete resource with id ${id}`, error);
            return false;
        }
    }

    /**
     * Clears all the resource records
     */
    async clear(): Promise<void> {
        try {
            await resourcesDatabase('resources').del();
            this.logger.info(`All resources cleared.`);
        } catch (error) {
            this.logger.error(`Failed to delete resources`, error);
        }
    }

    /**
     * Inserts multiple resources in the database
     * @param resources Array of IResource
     * @returns boolean Successfully inserted or not
     */
    async importData(resources: IResource[]): Promise<boolean> {
        try {
            const result = await resourcesDatabase('resources').insert(resources);
            this.logger.info(`Resource data imported`);
            return result.length > 0;
        } catch (error) {
            this.logger.error('Error inserting multiple resources: ', error);
            return false;
        }
    }
}
