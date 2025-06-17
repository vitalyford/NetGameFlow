/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { cloudflare } from "@cloudflare/vite-plugin";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const isTest = mode === 'test';
  
  return {
    plugins: [
      react(),
      // Only use Cloudflare plugin when not running tests
      ...(!isTest ? [cloudflare()] : [])
    ],
    resolve: {
      alias: {
        '@': '/src',
        '@/components': '/src/components',
        '@/utils': '/src/utils',
        '@/types': '/src/types',
        '@/hooks': '/src/hooks',
        '@/contexts': '/src/contexts',
        '@/assets': '/src/assets',
      },
    },
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: ['./src/test/setup.ts'],
      css: true,
      coverage: {
        provider: 'v8',
        reporter: ['text', 'json', 'html'],
        exclude: [
          'node_modules/',
          'src/test/',
          '**/*.d.ts',
          '**/*.config.*',
          'dist/',
        ],
      },
    },
  };
});
