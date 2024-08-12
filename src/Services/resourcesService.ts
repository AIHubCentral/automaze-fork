/* Resources: Documentation links */

import fs from "fs/promises";
import { RESOURCES_DATABASE_PATH, resourcesDatabase } from "../Database/dbManager";
import winston from "winston";

export interface IResource {
    id?: number,
    category: string,
    url: string,
    displayTitle?: string,
    emoji?: string,
    authors?: string,
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
            return true;
        }
        catch (error) {
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
        }
        catch (error) {
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
        }
        catch (error) {
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
        }
        catch (error) {
            this.logger.error(`Error fetching resource with id ${id}`, error);
        }
    }

    async findByCategory(category: string): Promise<IResource[] | undefined> {
        try {
            const resources = await resourcesDatabase('resources').where({ category });
            this.logger.info('Resource fetched:', resources);
            return resources;
        }
        catch (error) {
            this.logger.error(`Error fetching resource with category ${category}`, error);
        }
    }

    update() { }

    /**
     * Deletes a resource by its id
     * @param id of the resource
     */
    async delete(id: number): Promise<void> {
        try {
            await resourcesDatabase('resources').where({ id }).del();
            this.logger.info(`Deleted resource with id ${id}`);

        }
        catch (error) {
            this.logger.error(`Failed to delete resource with id ${id}`, error);
        }
    }

    /**
     * Clears all the resource records
     */
    async clear(): Promise<void> {
        try {
            await resourcesDatabase('resources').del();
            this.logger.info(`All resources cleared.`);
        }
        catch (error) {
            this.logger.error(`Failed to delete resources`, error);
        }
    }

    toJSON() { }
}