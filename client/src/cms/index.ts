import client from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

export const sanityClient = client({
  apiVersion: '2021-10-21',
  dataset: 'production',
  projectId: 'mxdxtgmh',
  useCdn: true,
});

// Get a pre-configured url-builder from your sanity client
const builder = imageUrlBuilder(sanityClient);

// Then we like to make a simple function like this that gives the
// builder an image and returns the builder for you to specify additional
// parameters:
export const urlFor = (source: any) => {
  return builder.image(source);
};
