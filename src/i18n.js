import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import HttpApi from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import XHR from "i18next-http-backend";

i18next
    .use(XHR)
    .use(initReactI18next)
    .use(HttpApi)
    .use(LanguageDetector)
    .init({
        fallbackLng: "en",
        interpolation: {
            escapeValue: false,
        },
        whitelist: ["en", "ko", "pt"],
        debug: process.env.NODE_ENV === "development",
        detection: { order: ['path', 'navigator']},

    });

i18next.changeLanguage()

export default i18next;