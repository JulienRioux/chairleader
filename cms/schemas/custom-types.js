import { supportedLanguages } from './supported-languages';

export const localeString = {
  fields: supportedLanguages.map((lang) => ({
    fieldset: lang.isDefault ? null : 'translations',
    name: lang.id,
    title: lang.title,
    type: 'string',
  })),
  fieldsets: [
    {
      name: 'translations',
      options: { collapsible: true },
      title: 'Translations',
    },
  ],
  name: 'localeString',
  title: 'Localized string',
  type: 'object',
};

export const richText = {
  name: 'richText',
  of: [
    {
      type: 'block',
    },
  ],
  type: 'array',
};

export const localeRichText = {
  fields: supportedLanguages.map((lang) => ({
    fieldset: lang.isDefault ? null : 'translations',
    name: lang.id,
    title: lang.title,
    type: 'richText',
  })),
  fieldsets: [
    {
      name: 'translations',
      options: { collapsible: true },
      title: 'Translations',
    },
  ],
  name: 'localeRichText',
  type: 'object',
};
