/** Generate a 6 digit number as a string */
export const generateOpt = () =>
  Math.floor(Math.random() * 999999)
    .toString()
    .padStart(6, '0');
