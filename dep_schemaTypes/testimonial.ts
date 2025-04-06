const testimonial = {
    name: 'testimonial',
    title: 'Testimonial',
    type: 'object',
    fields: [
      {
        name: 'quote',
        title: 'Quote',
        type: 'text',
      },
      {
        name: 'name',
        title: 'Name',
        type: 'string',
      },
      {
        name: 'image',
        title: 'Image',
        type: 'image',
        options: { hotspot: true },
      },
    ],
  };
  
  export default testimonial;