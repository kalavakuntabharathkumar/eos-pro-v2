import { defineConfig } from 'orval';

export default defineConfig({
  enterpriseOs: {
    input: './openapi.yaml',
    output: {
      mode: 'split',
      target: '../api-client-react/src/generated/api.ts',
      schemas: '../api-client-react/src/generated/api.schemas.ts',
      client: 'react-query',
      override: {
        mutator: {
          path: '../api-client-react/src/custom-fetch.ts',
          name: 'customFetch',
        },
      },
    },
  },
  enterpriseOsZod: {
    input: './openapi.yaml',
    output: {
      mode: 'split',
      target: '../api-zod/src/generated/api.ts',
      client: 'zod',
    },
  },
});
