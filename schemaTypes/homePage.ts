export default {
    name: 'homePage',
    type: 'document',
    title: 'Homepage',
    fields: [
      {
        name: 'heroTitle',
        type: 'string',
        title: 'Hero Title',
      },
      {
        name: 'heroSubtitle',
        type: 'text',
        title: 'Hero Subtitle',
      },
      {
        name: 'featuredTools',
        type: 'array',
        title: 'Featured Tools',
        of: [{ type: 'reference', to: [{ type: 'toolPage' }] }],
      },
      {
        name: 'mainCTA',
        type: 'reference',
        to: [{ type: 'ctaBlock' }],
        title: 'Main CTA Block',
      }
    ]
  }