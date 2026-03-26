import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
    plugins: [
        tailwindcss(),
        VitePWA({
            registerType: 'prompt',
            workbox: {
                globPatterns: ['**/*.{js,css,html,png,svg}']
            },
            includeAssets: [],
            manifest: {
                name: 'OSDev Tools',
                short_name: 'OSDev',
                theme_color: '#09090b',
                background_color: '#ffffff',
                display: 'standalone',
                icons: []
            }
        })
    ],
    root: 'src',
    publicDir: '../public',
    build: {
        outDir: '../dist',
        emptyOutDir: true,
    }
});
