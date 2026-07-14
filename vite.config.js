import { defineConfig } from "vite";

import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({

    plugins: [

        react(),

        tailwindcss(),

        VitePWA({

            registerType: "autoUpdate",

            injectRegister: false,

            includeAssets: [

                "favicon.ico",

                "pwa-192x192.png",

                "pwa-512x512.png",

            ],

            manifest: {

                id: "/",

                name: "Staff Manager",

                short_name: "Staff Manager",

                description:
                    "직원, 근태, 급여, 공지와 정책을 관리하는 프로그램",

                lang: "ko-KR",

                start_url: "/",

                scope: "/",

                display: "standalone",

                orientation: "any",

                background_color: "#f5f6f8",

                theme_color: "#1f73b9",

                prefer_related_applications: false,

                icons: [

                    {

                        src: "/pwa-192x192.png",

                        sizes: "192x192",

                        type: "image/png",

                        purpose: "any",

                    },

                    {

                        src: "/pwa-512x512.png",

                        sizes: "512x512",

                        type: "image/png",

                        purpose: "any",

                    },

                    {

                        src: "/pwa-512x512.png",

                        sizes: "512x512",

                        type: "image/png",

                        purpose: "maskable",

                    },

                ],

            },

            workbox: {

                globPatterns: [

                    "**/*.{js,css,html,ico,png,svg,woff,woff2}",

                ],

                navigateFallback: "/index.html",

                cleanupOutdatedCaches: true,

            },

            devOptions: {

                enabled: true,

            },

        }),

    ],

});