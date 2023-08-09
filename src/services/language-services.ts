import en from '../configs/lang/en.json';
import fr from '../configs/lang/fr.json';

const languages = {
    en,
    fr
};

export const LanguageService = {
    activeLanguage: 'en', // Default language

    setActiveLanguage(language: string) {
        this.activeLanguage = language;
    },

    getContent(key: string) {
        const activeLanguageData = languages[this.activeLanguage];
        const keys = key.split('.'); // Split the key by dot to access nested properties

        let value = activeLanguageData;
        for (const k of keys) {
            if (value && value.hasOwnProperty(k)) {
                value = value[k];
            } else {
                // Fallback to the original key if translation is missing
                return key;
            }
        }

        return value;
    }

};
