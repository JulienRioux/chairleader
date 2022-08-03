import * as React from 'react';
import { render } from '@testing-library/react';
import Modal from '../';

const ModalWithProviders = (props: any) => <Modal {...props} />;

describe('<Modal />', () => {
  describe('should have this remove', () => {
    it('when the component is actually used', () => {
      const text = 'it works';
      const props = { text };
      const { getByText } = render(<ModalWithProviders {...props} />);
      const textSpan = getByText(text);

      expect(textSpan).toBeTruthy();
    });
  });
});
