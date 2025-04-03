const euBenefitsBlock = {
    name: 'euBenefitsBlock',
    title: 'EU Benefits Block',
    type: 'object',
    fields: [
      {
        name: 'headline',
        title: 'Headline',
        type: 'string',
      },
      {
        name: 'paragraph',
        title: 'Paragraph',
        type: 'text',
      },
      {
        name: 'image',
        title: 'Image',
        type: 'image',
        options: { hotspot: true },
      },
    ],
  };
  
  export default euBenefitsBlock;