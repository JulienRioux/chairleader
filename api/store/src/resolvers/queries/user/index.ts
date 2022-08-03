export const getMeQuery = async (_parent: any, args: null, context) => {
  // Maybe we should fetch the user from the DB here if we want less stuff in the context
  return context.user;
};
