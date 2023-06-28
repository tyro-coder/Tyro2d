// vite.config.js
import { resolve } from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'Tyro2d',
      fileName: 'tyro2d',
    },
  },
  plugins: [
    dts({
      beforeWriteFile: (filePath, content) => ({
        filePath: filePath.replace(/src/, ''),
        content,
      }),
    }),
  ],
});
