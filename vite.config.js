import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue2"
import { resolve } from 'node:path'

export default defineConfig({
    plugins: [
        vue(),
    ],
    resolve: {
        alias: [
            {
                find: "@",
                replacement: "/src"
            }
        ]
    },
    build: {
        rollupOptions: {
            input: {
                component: resolve(__dirname, 'index.html')
            }
        }
    },
    server:{
        port:4444
    }
})