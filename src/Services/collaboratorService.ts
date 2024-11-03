import winston from 'winston';
import knexInstance from '../db';

export interface ICollaborator {
    discordId: string;
    username: string;
    displayName?: string;
}

export default class CollaboratorService {
    private logger: winston.Logger;

    constructor(logger: winston.Logger) {
        this.logger = logger;
    }

    async insert(resource: ICollaborator): Promise<number> {
        try {
            const [discord_id] = await knexInstance('collaborators').insert(resource);
            this.logger.info(`Collaborator ${discord_id} added`);
            return discord_id;
        } catch (error) {
            this.logger.error('Error adding collaborator: ', error);
            return -1;
        }
    }

    async findAll(): Promise<ICollaborator[]> {
        const queryResult: ICollaborator[] = await knexInstance('collaborators').select('*');
        return queryResult;
    }

    async findById(id: string): Promise<ICollaborator | undefined> {
        try {
            const resource = await knexInstance('collaborators').where({ discordId: id }).first();
            this.logger.info('Collaborator fetched:', resource);
            return resource;
        } catch (error) {
            this.logger.error(`Error fetching collaborator with id ${id}`, error);
        }
    }

    /*
    async update(id: number, resource: Partial<ICollaborator>): Promise<boolean> {
        try {
            await knexInstance('resources').where({ id }).update(resource);
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
    async delete(id: string): Promise<boolean> {
        try {
            await knexInstance('collaborators').where({ discordId: id }).del();
            this.logger.info(`Deleted collaborator with id ${id}`);
            return true;
        } catch (error) {
            this.logger.error(`Failed to delete collaborator with id ${id}`, error);
            return false;
        }
    }
}
