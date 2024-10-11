import i18next from 'i18next';
import Backend from 'i18next-fs-backend';

export const initI18n = async () => {
    await i18next.use(Backend).init({
        fallbackLng: 'en',
        preload: ['en', 'pt'],
        backend: {
            loadPath: './locales/{{lng}}/translation.json',
        },
    });

    return i18next;
};

// Export the initialized instance for reuse
export default i18next;
