import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://www.asighn.com',
  trailingSlash: 'never',
  build: { format: 'file' },
});
