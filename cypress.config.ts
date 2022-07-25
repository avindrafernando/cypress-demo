import { defineConfig } from 'cypress'

export default defineConfig({
  viewportWidth: 600,
  viewportHeight: 800,
  env: {},
  videoCompression: false,
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      return require('./cypress/plugins/index.js')(on, config)
    },
    excludeSpecPattern: [
      '**/answer/*',
      '*answer.js',
      '*.d.ts',
      '**/__snapshots__/*',
      '**/__image_snapshots__/*',
      '**/13-app-actions/todo-page-object.js',
      '**/13-app-actions/utils.js',
      '**/17-component-testing/filters.js',
      '**/17-component-testing/*.jsx',
      'cypress/e2e/workshop/**',
      '**/06-app-data-state/*',
    ],
    baseUrl: 'http://localhost:3000',
  },
})
