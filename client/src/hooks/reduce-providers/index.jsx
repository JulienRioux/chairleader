import React from 'react';

export const ReduceProviders = ({ providers, children }) => {
  return (
    <>
      {providers.reduceRight((acc, Comp) => {
        return <Comp>{acc}</Comp>;
      }, children)}
    </>
  );
};
