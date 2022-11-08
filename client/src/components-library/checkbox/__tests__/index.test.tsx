import * as React from 'react';
import { render } from '@testing-library/react';
import Checkbox from '..';

const CheckboxWithProviders = (props: any) => <Checkbox {...props} />;

describe('<Checkbox />', () => {
  describe('should have this remove', () => {
    it('when the component is actually used', () => {
      const text = 'it works';
      const props = { text };
      const { getByText } = render(<CheckboxWithProviders {...props} />);
      const textSpan = getByText(text);

      expect(textSpan).toBeTruthy();
    });
  });
});
