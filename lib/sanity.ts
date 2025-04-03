import { createClient } from '@sanity/client'

export const sanity = createClient({
  projectId: 'kabpbxao', 
  dataset: 'production',
  apiVersion: '2023-01-01', // or latest
  useCdn: true,
})