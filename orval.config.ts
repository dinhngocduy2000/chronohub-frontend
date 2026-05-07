import { defineConfig } from 'orval'

export default defineConfig({
  chronohub: {
    input: {
      target: 'http://localhost:8000/api/v1/openapi.json',
    },
    output: {
      mode: 'tags-split',
      target: './src/generated/api',
      schemas: './src/generated/types',
      client: 'axios',
      override: {
        mutator: {
          path: './src/api/custom-instance.ts',
          name: 'customInstance',
        },
      },
    },
  },
})
