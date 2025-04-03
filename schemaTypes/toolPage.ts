export default {
    name: 'toolPage',
    title: 'Tool Page',
    type: 'document',
    fields: [
      {
        name: 'heroTitle',
        title: 'Hero Title',
        type: 'string',
      },
      {
        name: 'slug',
        title: 'Slug',
        type: 'slug',
        options: {
          source: 'heroTitle',
          maxLength: 96,
        },
      },
      {
        name: 'heroImage',
        title: 'Hero Image',
        type: 'image',
        options: {
          hotspot: true,
        },
      },
      {
        name: 'heroParagraph',
        title: 'Hero Paragraph',
        type: 'text',
      },
      {
        name: 'heroCtaPrimary',
        title: 'Hero CTA Primary Button Text',
        type: 'string',
      },
      {
        name: 'heroCtaSecondary',
        title: 'Hero CTA Secondary Button Text',
        type: 'string',
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
        name: 'comparisonHeadline',
        title: 'Comparison Table Headline',
        type: 'string',
      },
      {
        name: 'comparisonTable',
        title: 'Comparison Table',
        type: 'comparisonTable',
      },
      {
        name: 'ctaHeadline',
        title: 'CTA Footer Headline',
        type: 'string',
      },
      {
        name: 'ctaSubtext',
        title: 'CTA Footer Subtext',
        type: 'text',
      },
      {
        name: 'ctaButtonLabel',
        title: 'CTA Footer Button Label',
        type: 'string',
      },
      {
        name: 'toolSpecificSections',
        title: 'Tool Specific Sections',
        type: 'array',
        of: [{ type: 'portableTextBlock' }],
      },
      {
        name: 'euBenefits',
        title: 'EU Benefits',
        type: 'euBenefitsBlock',
      },
      {
        name: 'testimonials',
        title: 'Testimonials',
        type: 'array',
        of: [{ type: 'testimonial' }],
      },
      {
        name: 'faqs',
        title: 'FAQs',
        type: 'array',
        of: [{ type: 'faqItem' }],
      },
    ],
  }