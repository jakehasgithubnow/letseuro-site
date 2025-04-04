const comparisonTable = {
    name: 'comparisonTable',
    title: 'Comparison Table',
    type: 'object',
    fields: [
      {
        name: 'headline',
        title: 'Headline',
        type: 'string',
      },
      {
        name: 'competitorHeading',
        title: 'Competitor Heading',
        type: 'string',
      },
      {
        name: 'thisToolHeading',
        title: 'This Tool Heading',
        type: 'string',
      },
      {
        name: 'rows',
        title: 'Rows',
        type: 'array',
        of: [
          {
            type: 'object',
            fields: [
              { name: 'feature', title: 'Feature', type: 'string' },
              { name: 'thisTool', title: 'This Tool', type: 'boolean' },
              { name: 'competitor', title: 'Competitor', type: 'boolean' },
            ],
          },
        ],
      },
      {
        name: 'bottomText',
        title: 'Bottom Text',
        type: 'text',
      },
    ],
  };
  
  export default comparisonTable;
