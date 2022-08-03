export const get = async (request, response) => {
  const label = request.query.label;
  if (!label) throw new Error('missing label');
  if (typeof label !== 'string') throw new Error('invalid label');

  const icon =
    request.query.icon ??
    'https://s3.amazonaws.com/pix.iemoji.com/images/emoji/apple/ios-12/256/running-shoe.png';

  response.status(200).send({
    label,
    icon,
  });
};
