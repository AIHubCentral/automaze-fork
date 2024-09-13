"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dbManager_1 = require("../Database/dbManager");
class CollaboratorService {
    constructor(logger) {
        this.logger = logger;
    }
    async insert(resource) {
        try {
            const [discord_id] = await (0, dbManager_1.resourcesDatabase)('collaborators').insert(resource);
            this.logger.info(`Collaborator ${discord_id} added`);
            return discord_id;
        }
        catch (error) {
            this.logger.error('Error adding collaborator: ', error);
            return -1;
        }
    }
    async findAll() {
        const queryResult = await (0, dbManager_1.resourcesDatabase)('collaborators').select('*');
        return queryResult;
    }
    async findById(id) {
        try {
            const resource = await (0, dbManager_1.resourcesDatabase)('collaborators').where({ discordId: id }).first();
            this.logger.info('Collaborator fetched:', resource);
            return resource;
        }
        catch (error) {
            this.logger.error(`Error fetching collaborator with id ${id}`, error);
        }
    }
    /*
    async update(id: number, resource: Partial<ICollaborator>): Promise<boolean> {
        try {
            await resourcesDatabase('resources').where({ id }).update(resource);
            this.logger.info(`Resouce with id ${id} updated`);
            return true;
        }
        catch (error) {
            this.logger.error(`Failed updating resource with id ${id}`, error);
            return false;
        }
    } */
    /**
     * Deletes a resource by its id
     * @param id of the resource
     */
    async delete(id) {
        try {
            await (0, dbManager_1.resourcesDatabase)('collaborators').where({ discordId: id }).del();
            this.logger.info(`Deleted collaborator with id ${id}`);
            return true;
        }
        catch (error) {
            this.logger.error(`Failed to delete collaborator with id ${id}`, error);
            return false;
        }
    }
}
exports.default = CollaboratorService;
