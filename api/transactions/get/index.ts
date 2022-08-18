export const get = async (request, response) => {
  const label = request.query.label;
  if (!label) throw new Error('missing label');
  if (typeof label !== 'string') throw new Error('invalid label');

  const icon =
    request.query.icon ??
    'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/320/apple/325/chair_1fa91.png';

  //
  response.status(200).send({
    label,
    icon,
  });
};
