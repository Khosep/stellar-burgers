import { defineConfig } from "cypress";
import dotenv from 'dotenv';
dotenv.config();

export default defineConfig({
  e2e: {
    baseUrl: process.env.TEST_BASE_URL || 'http://localhost:4000',
    env: {
      API_URL: process.env.BURGER_API_URL,
    },
    excludeSpecPattern: [
      'cypress/e2e/1-getting-started/*',
      '**/2-advanced-examples/*',
    ],
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
