"use strict";
/* Resources: Documentation links */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("../db"));
class ResourceService {
    logger;
    constructor(logger) {
        this.logger = logger;
    }
    /**
     * Inserts a resource in the database
     * @param resource Object of type IResource
     * @returns The id of the inserted record
     */
    async insert(resource) {
        try {
            const [id] = await (0, db_1.default)('resources').insert(resource);
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
        const queryResult = await (0, db_1.default)('resources').select('*');
        return queryResult;
    }
    async findById(id) {
        try {
            const resource = await (0, db_1.default)('resources').where({ id }).first();
            this.logger.info('Resource fetched:', resource);
            return resource;
        }
        catch (error) {
            this.logger.error(`Error fetching resource with id ${id}`, error);
        }
    }
    async findByCategory(category) {
        try {
            const resources = await (0, db_1.default)('resources').where({ category });
            if (!resources) {
                this.logger.debug(`No resource found for ${category}`);
                return [];
            }
            this.logger.debug(`${resources.length} resources fetched for ${category}`);
            return resources;
        }
        catch (error) {
            this.logger.error(`Error fetching resource with category ${category}`, error);
            return [];
        }
    }
    async getPaginatedResult(offset, recordsPerPage, filter) {
        this.logger.debug('Requesting paginated resources', { offset, recordsPerPage });
        let data = null;
        let counter = undefined;
        if (filter) {
            data = await (0, db_1.default)('resources')
                .select('*')
                .where(filter.column, filter.value)
                .limit(recordsPerPage)
                .offset(offset);
            counter = await (0, db_1.default)('resources')
                .where(filter.column, filter.value)
                .count('* as count')
                .first();
        }
        else {
            data = await (0, db_1.default)('resources').select('*').limit(recordsPerPage).offset(offset);
            counter = await (0, db_1.default)('resources').count('* as count').first();
        }
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
            await (0, db_1.default)('resources').where({ id }).update(resource);
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
            await (0, db_1.default)('resources').where({ id }).del();
            this.logger.info(`Deleted resource with id ${id}`);
            return true;
        }
        catch (error) {
            this.logger.error(`Failed to delete resource with id ${id}`, error);
            return false;
        }
    }
    /**
     * Clears all the resource records
     */
    async clear() {
        try {
            await (0, db_1.default)('resources').del();
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
            const result = await (0, db_1.default)('resources').insert(resources);
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
