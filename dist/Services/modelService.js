"use strict";
/**
 * Cache models to be consulted later when a user requests a new model
 * The purpose is to check if a model they are requesting already exists
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WeightsModelService = void 0;
const BaseService_1 = __importDefault(require("./BaseService"));
class ModelService extends BaseService_1.default {
    constructor(knex) {
        super(knex, 'models');
    }
}
exports.default = ModelService;
class WeightsModelService extends BaseService_1.default {
    constructor(knex) {
        super(knex, 'weights_models');
    }
    async create(data) {
        if (!data.url) {
            data.url = `https://www.weights.gg/models/${data.id}`;
        }
        return super.create(data);
    }
}
exports.WeightsModelService = WeightsModelService;
