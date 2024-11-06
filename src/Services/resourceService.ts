/* Resources: Documentation links */

import Knex from 'knex';
import BaseService from './BaseService';

export interface IResource {
    id: number;
    category: string;
    url: string;
    displayTitle?: string;
    emoji?: string;
    authors?: string;
}

export default class ResouceService extends BaseService<IResource> {
    constructor(knex: Knex.Knex) {
        super(knex, 'resources');
    }
}

// export default class ResourceService {
//     private logger: winston.Logger;

//     constructor(logger: winston.Logger) {
//         this.logger = logger;
//     }

//     /**
//      * Inserts a resource in the database
//      * @param resource Object of type IResource
//      * @returns The id of the inserted record
//      */
//     async insert(resource: IResource): Promise<number> {
//         try {
//             const [id] = await knexInstance('resources').insert(resource);
//             this.logger.info(`Resource created with ID: ${id}`);
//             return id;
//         } catch (error) {
//             this.logger.error('Error creating resource: ', error);
//             return -1;
//         }
//     }

//     /**
//      * Gets all records in the resources database
//      * @returns Array of IResource
//      */
//     async findAll(): Promise<IResource[]> {
//         const queryResult: IResource[] = await knexInstance('resources').select('*');
//         return queryResult;
//     }

//     async findById(id: number): Promise<IResource | undefined> {
//         try {
//             const resource = await knexInstance('resources').where({ id }).first();
//             this.logger.info('Resource fetched:', resource);
//             return resource;
//         } catch (error) {
//             this.logger.error(`Error fetching resource with id ${id}`, error);
//         }
//     }

//     async findByCategory(category: string): Promise<IResource[]> {
//         try {
//             const resources = await knexInstance('resources').where({ category });

//             if (!resources) {
//                 this.logger.debug(`No resource found for ${category}`);
//                 return [];
//             }

//             this.logger.debug(`${resources.length} resources fetched for ${category}`);

//             return resources;
//         } catch (error) {
//             this.logger.error(`Error fetching resource with category ${category}`, error);
//             return [];
//         }
//     }

//     async getPaginatedResult(
//         offset: number,
//         recordsPerPage: number,
//         filter?: { column: string; value: string }
//     ) {
//         this.logger.debug('Requesting paginated resources', { offset, recordsPerPage });

//         let data = null;
//         let counter = undefined;

//         if (filter) {
//             data = await knexInstance('resources')
//                 .select('*')
//                 .where(filter.column, filter.value)
//                 .limit(recordsPerPage)
//                 .offset(offset);
//             counter = await knexInstance('resources')
//                 .where(filter.column, filter.value)
//                 .count('* as count')
//                 .first();
//         } else {
//             data = await knexInstance('resources').select('*').limit(recordsPerPage).offset(offset);
//             counter = await knexInstance('resources').count('* as count').first();
//         }
//         return { data, counter };
//     }

//     /**
//      *
//      * @param id Resource ID
//      * @param resource Object
//      * @returns boolean Whether the operation succeeded
//      */
//     async update(id: number, resource: Partial<IResource>): Promise<boolean> {
//         try {
//             await knexInstance('resources').where({ id }).update(resource);
//             this.logger.info(`Resouce with id ${id} updated`);
//             return true;
//         } catch (error) {
//             this.logger.error(`Failed updating resource with id ${id}`, error);
//             return false;
//         }
//     }

//     /**
//      * Deletes a resource by its id
//      * @param id of the resource
//      */
//     async delete(id: number): Promise<boolean> {
//         try {
//             await knexInstance('resources').where({ id }).del();
//             this.logger.info(`Deleted resource with id ${id}`);
//             return true;
//         } catch (error) {
//             this.logger.error(`Failed to delete resource with id ${id}`, error);
//             return false;
//         }
//     }

//     /**
//      * Clears all the resource records
//      */
//     async clear(): Promise<void> {
//         try {
//             await knexInstance('resources').del();
//             this.logger.info(`All resources cleared.`);
//         } catch (error) {
//             this.logger.error(`Failed to delete resources`, error);
//         }
//     }

//     /**
//      * Inserts multiple resources in the database
//      * @param resources Array of IResource
//      * @returns boolean Successfully inserted or not
//      */
//     async importData(resources: IResource[]): Promise<boolean> {
//         try {
//             const result = await knexInstance('resources').insert(resources);
//             this.logger.info(`Resource data imported`);
//             return result.length > 0;
//         } catch (error) {
//             this.logger.error('Error inserting multiple resources: ', error);
//             return false;
//         }
//     }
// }
