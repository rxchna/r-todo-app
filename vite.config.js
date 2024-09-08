import { defineConfig } from 'vite';

export default defineConfig({
    root: 'public',
    server: {
        port: 2000,
        proxy: {
            '/tasks': {
                target: 'http://localhost:3000'
            }
        }
    }
});
