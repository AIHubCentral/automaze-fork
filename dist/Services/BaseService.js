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
        const { limit = 100, offset = 0, sortBy = 'id', sortOrder = 'asc' } = options;
        const data = (await this.knex(this.tableName)
            .select('*')
            .limit(limit)
            .offset(offset)
            .orderBy(sortBy, sortOrder));
        const totalItemsResult = await this.knex(this.tableName).count('* as count').first();
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
}
exports.default = BaseService;
