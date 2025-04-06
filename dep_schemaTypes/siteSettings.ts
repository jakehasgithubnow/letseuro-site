import { defineType } from 'sanity'

export default defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    {
      name: 'logo',
      title: 'Logo',
      type: 'image',
      options: { hotspot: true },
    },
    {
      name: 'partnerLogos',
      title: 'Partner Logos',
      type: 'array',
      of: [{ type: 'image' }],
    },
    {
      name: 'euBenefitsHeadline',
      title: 'EU Benefits Headline',
      type: 'string',
    },
    {
      name: 'euBenefitsParagraph',
      title: 'EU Benefits Paragraph',
      type: 'text',
    },
    {
      name: 'euBenefitsImage',
      title: 'EU Benefits Image',
      type: 'image',
      options: { hotspot: true },
    },
    {
      name: 'featuresTitle',
      title: 'Features Section Title',
      type: 'string',
    },
    {
      name: 'featuresSubtitle',
      title: 'Features Section Subtitle',
      type: 'text',
    },
    {
      name: 'features',
      title: 'Features',
      type: 'array',
      of: [{ type: 'feature' }],
    },
    {
      name: 'footerColumns',
      title: 'Footer Columns',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'title', type: 'string', title: 'Column Title' },
            { name: 'items', type: 'array', of: [{ type: 'string' }], title: 'Items' },
          ],
        },
      ],
    },
  ],
})
