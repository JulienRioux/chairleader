import { screen } from '@testing-library/react';
import { renderWithProviders } from 'utils';

import { ErrorPage } from '..';

describe('<ErrorPage />', () => {
  it('Artist header', () => {
    renderWithProviders(<ErrorPage />);

    // Make sure the title is rendered
    const title = screen.queryByTestId('error-page-title');
    expect(title).toHaveTextContent('Page Not Found');

    // Make sure the 2 buttons are in the page
    const buttons = screen.getAllByRole('button');
    expect(buttons[0]).toHaveTextContent('Homapage');
  });
});
