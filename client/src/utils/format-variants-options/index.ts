export const formatVariantsOptions = (options: string[]) =>
  options.reduce((acc, option) => {
    if (acc === '') return option;
    return acc + ' / ' + option;
  }, '');
