import { defineConfig } from "vite"
import { createVuePlugin } from "vite-plugin-vue2";

export default defineConfig({
    plugins: [
        createVuePlugin({
            vueTemplateOptions: {},
        }),
    ],
    resolve: {
        alias: [
            {
                find: "@",
                replacement: "/src"
            },
            {
                find: "sty",
                replacement: "/src/styles"
            },
            {
                find: "pkg",
                replacement: "/packages"
            }
        ]
    },
    build: {
        rollupOptions: {
            input: {
                component: './index.html'
            }
        }
    },
    server: {
        port: 4444
    }
})