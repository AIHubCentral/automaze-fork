"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initI18n = void 0;
const i18next_1 = __importDefault(require("i18next"));
const i18next_fs_backend_1 = __importDefault(require("i18next-fs-backend"));
const initI18n = async () => {
    await i18next_1.default.use(i18next_fs_backend_1.default).init({
        fallbackLng: 'en',
        preload: ['en', 'es', 'it', 'pt'],
        backend: {
            loadPath: './locales/{{lng}}/translation.json',
        },
        interpolation: {
            escapeValue: false,
        },
    });
    return i18next_1.default;
};
exports.initI18n = initI18n;
// Export the initialized instance for reuse
exports.default = i18next_1.default;
