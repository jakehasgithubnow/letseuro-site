const feature = {
    name: 'feature',
    title: 'Feature',
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
  
  export default feature;