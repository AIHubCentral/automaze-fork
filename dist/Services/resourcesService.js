"use strict";
/* Resources: Documentation links */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const promises_1 = __importDefault(require("fs/promises"));
const dbManager_1 = require("../Database/dbManager");
class ResourceService {
    constructor(logger) {
        this.logger = logger;
    }
    /**
     * Initializes the resources.sqlite database schema by creating the tables
     *
     * @returns boolean Whether the database was successfully created or not
     */
    async createDatabase() {
        try {
            await dbManager_1.resourcesDatabase.schema.createTable('resources', (table) => {
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
    async dropDatabase() {
        try {
            await dbManager_1.resourcesDatabase.destroy();
            await promises_1.default.unlink(dbManager_1.RESOURCES_DATABASE_PATH);
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
    async insert(resource) {
        try {
            const [id] = await (0, dbManager_1.resourcesDatabase)('resources').insert(resource);
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
    async findAll() {
        const queryResult = await (0, dbManager_1.resourcesDatabase)('resources').select('*');
        return queryResult;
    }
    async findById(id) {
        try {
            const resource = await (0, dbManager_1.resourcesDatabase)('resources').where({ id }).first();
            this.logger.info('Resource fetched:', resource);
            return resource;
        }
        catch (error) {
            this.logger.error(`Error fetching resource with id ${id}`, error);
        }
    }
    async findByCategory(category) {
        try {
            const resources = await (0, dbManager_1.resourcesDatabase)('resources').where({ category });
            this.logger.info('Resource fetched:', resources);
            if (!resources) {
                return [];
            }
            return resources;
        }
        catch (error) {
            this.logger.error(`Error fetching resource with category ${category}`, error);
            return [];
        }
    }
    async getPaginatedResult(offset, recordsPerPage) {
        this.logger.debug('Requesting paginated resources', { offset, recordsPerPage });
        const data = await (0, dbManager_1.resourcesDatabase)('resources').select('*').limit(recordsPerPage).offset(offset);
        const counter = await (0, dbManager_1.resourcesDatabase)('resources').count('* as count').first();
        return { data, counter };
    }
    /**
     *
     * @param id Resource ID
     * @param resource Object
     * @returns boolean Whether the operation succeeded
     */
    async update(id, resource) {
        try {
            await (0, dbManager_1.resourcesDatabase)('resources').where({ id }).update(resource);
            this.logger.info(`Resouce with id ${id} updated`);
            return true;
        }
        catch (error) {
            this.logger.error(`Failed updating resource with id ${id}`, error);
            return false;
        }
    }
    /**
     * Deletes a resource by its id
     * @param id of the resource
     */
    async delete(id) {
        try {
            await (0, dbManager_1.resourcesDatabase)('resources').where({ id }).del();
            this.logger.info(`Deleted resource with id ${id}`);
        }
        catch (error) {
            this.logger.error(`Failed to delete resource with id ${id}`, error);
        }
    }
    /**
     * Clears all the resource records
     */
    async clear() {
        try {
            await (0, dbManager_1.resourcesDatabase)('resources').del();
            this.logger.info(`All resources cleared.`);
        }
        catch (error) {
            this.logger.error(`Failed to delete resources`, error);
        }
    }
    /**
     * Inserts multiple resources in the database
     * @param resources Array of IResource
     * @returns boolean Successfully inserted or not
     */
    async importData(resources) {
        try {
            const result = await (0, dbManager_1.resourcesDatabase)('resources').insert(resources);
            this.logger.info(`Resource data imported`);
            return result.length > 0;
        }
        catch (error) {
            this.logger.error('Error inserting multiple resources: ', error);
            return false;
        }
    }
}
exports.default = ResourceService;
