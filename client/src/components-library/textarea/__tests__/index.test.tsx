import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { Input } from '..';

// eslint-disable-next-line @typescript-eslint/no-empty-function
const commonProps = { value: '', onChange: () => {} };

describe('<Input />', () => {
  it('Make sure the Input is displayed.', () => {
    render(<Input {...commonProps} data-testid="input" />);
    expect(screen.getByTestId('input')).toBeInTheDocument();
  });
});
