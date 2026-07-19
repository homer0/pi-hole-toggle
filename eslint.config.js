import { defineConfig } from 'eslint/config';
import { createConfig } from '@homer0/eslint-plugin/create';

export default defineConfig([
  {
    ignores: ['public/vendor/**'],
  },
  createConfig({
    importUrl: import.meta.url,
    configs: ['node-ts-with-prettier'],
  }),
]);
