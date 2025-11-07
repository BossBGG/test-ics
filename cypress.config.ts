import { defineConfig } from 'cypress'
import vitePreprocessor from 'cypress-vite'

export default defineConfig({
  projectId: '6xn5k2',
  e2e: {
    baseUrl: 'https://ics-y3-dev.pea.co.th',
    env: {
      baseUrl: 'http://localhost:1234',
      ssoUrl: 'https://sso2.pea.co.th'
    },
    chromeWebSecurity: false,
    specPattern: 'cypress/e2e/**/*.spec.*',
    supportFile: false,
    setupNodeEvents(on) {
      on('file:preprocessor', vitePreprocessor())
    },
    numTestsKeptInMemory: 0,
    defaultCommandTimeout: 10000,
    pageLoadTimeout: 60000,
  },
})
