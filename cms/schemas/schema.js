import createSchema from 'part:@sanity/base/schema-creator';
import schemaTypes from 'all:part:@sanity/base/schema-type';
import { localeString, localeRichText, richText } from './custom-types';
import { createStaticPageSchema } from './static-pages-schema';

const staticPages = [
  {
    name: 'terms-of-service',
    title: 'Terms of service',
  },
  {
    name: 'privacy-policy',
    title: 'Privacy policy',
  },
];

const assets = {
  fields: [
    {
      name: 'metaTagsImage',
      title: 'Meta tags Image',
      type: 'image',
    },
    {
      name: 'loginEmailImage',
      title: 'Login Email Image',
      type: 'image',
    },
  ],
  name: 'assets',
  title: 'Assets',
  type: 'document',
};

const changelog = {
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
    },
    {
      name: 'image',
      title: 'Image',
      type: 'image',
    },
    {
      name: 'content',
      title: 'Content',
      type: 'richText',
    },
    {
      name: 'releaseDate',
      title: 'Release date',
      type: 'date',
    },
  ],
  name: 'changelogs',
  title: 'Changelogs',
  type: 'document',
};

const changelogsArray = {
  name: 'changelogsArray',
  of: [changelog],
  title: 'changelogs Array',
  type: 'array',
};

const changelogs = {
  fields: [changelogsArray],
  name: 'changelogs',
  title: 'Changelogs',
  type: 'document',
};

// Then we give our schema to the builder and provide the result to Sanity
export default createSchema({
  // We name our schema
  name: 'default',
  // Then proceed to concatenate our document type
  // to the ones provided by any plugins that are installed
  types: schemaTypes.concat([
    localeString,
    localeRichText,
    richText,
    ...staticPages.map(({ title, name }) => createStaticPageSchema({ name, title })),
    assets,
    changelogs,
  ]),
});
