const portableTextBlock = {
    name: 'portableTextBlock',
    title: 'Portable Text Block',
    type: 'object',
    fields: [
      {
        name: 'content',
        title: 'Content',
        type: 'array',
        of: [{ type: 'block' }],
      },
    ],
  };
  
  export default portableTextBlock;