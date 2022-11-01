export const createStaticPageSchema = ({ name, title }) => ({
  fields: [
    {
      name: 'title',
      title: `${title} title`,
      type: 'localeString',
    },
    {
      name: 'text',
      title: `${title} text`,
      type: 'localeRichText',
    },
  ],
  name,
  title,
  type: 'document',
});
