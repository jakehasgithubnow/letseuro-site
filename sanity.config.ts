import { defineConfig } from 'sanity'
import { schemaTypes } from './schemaTypes'
import { deskTool } from 'sanity/desk'

export default defineConfig({
  name: 'default',
  title: 'Letseuro',

  projectId: 'kabpbxao',
  dataset: 'production',

  plugins: [deskTool()], // ← Use default desk structure

  schema: {
    types: schemaTypes,
  },
})