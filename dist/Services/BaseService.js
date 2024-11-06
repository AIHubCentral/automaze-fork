"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BaseService {
    tableName;
    knex;
    constructor(knex, tableName) {
        this.knex = knex;
        this.tableName = tableName;
    }
    async find(id) {
        const result = await this.knex(this.tableName).where('id', id).first();
        return result;
    }
    async findAll(options = {}) {
        const { limit = 100, offset = 0, sortBy = 'id', sortOrder = 'asc', filter } = options;
        const query = this.knex(this.tableName)
            .select('*')
            .limit(limit)
            .offset(offset)
            .orderBy(sortBy, sortOrder);
        // Apply filter if filter column and value are provided
        if (filter?.column && filter.value !== undefined) {
            query.where(filter.column, filter.value);
        }
        const data = (await query);
        // Get the total number of items (considering the filter) for pagination
        const totalItemsQuery = this.knex(this.tableName).count('* as count');
        if (filter && filter.column && filter.value !== undefined) {
            totalItemsQuery.where(filter.column, filter.value);
        }
        const totalItemsResult = await totalItemsQuery.first();
        const totalItems = parseInt(totalItemsResult?.count, 10) || 0;
        const hasNext = totalItems > offset + data.length;
        return { data, hasNext };
    }
    async create(data) {
        const [id] = await this.knex(this.tableName).insert(data).returning('id');
        return id.id;
    }
    async update(id, data) {
        return await this.knex(this.tableName).where({ id }).update(data);
    }
    async delete(id) {
        return await this.knex(this.tableName).where({ id }).delete();
    }
    async clearAll() {
        return await this.knex(this.tableName).del();
    }
}
exports.default = BaseService;
