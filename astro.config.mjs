<<<<<<< HEAD
import { defineConfig } from 'astro/config'
import vue from '@astrojs/vue'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  integrations: [vue()],
  vite: {
    plugins: [tailwindcss()]
  }
})
=======
// @ts-check
import { defineConfig } from 'astro/config';

import vue from '@astrojs/vue';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  integrations: [vue()],

  vite: {
    plugins: [tailwindcss()]
  }
});
>>>>>>> 8e9ead54c0bc0be8aa71448295b7f7703520ee6e
