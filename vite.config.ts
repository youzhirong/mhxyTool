import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'

import ViteComponents from 'unplugin-vue-components/vite';
import {AntDesignVueResolver} from 'unplugin-vue-components/resolvers';

// https://vitejs.dev/config/
export default defineConfig({
    base:"./",
    plugins: [vue(),
        ViteComponents({
            resolvers: [
                AntDesignVueResolver(),
            ],
        })
    ],
    resolve: {
        alias: {
            path: "path-browserify"
        },
    },

})
