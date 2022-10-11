import * as React from 'react';

import { IconWrapper } from './styled';

/**
 * Icon description:
 * Icon componsnt using the Google Font icons.
 * https://fonts.google.com/icons?selected=Material+Icons+Outlined
 */

// eslint-disable-next-line max-len
export const Icon = ({ name, style }: { name: string; style?: any }) => (
  <IconWrapper style={style ?? {}}>{name}</IconWrapper>
);

export * from './social-icons';
