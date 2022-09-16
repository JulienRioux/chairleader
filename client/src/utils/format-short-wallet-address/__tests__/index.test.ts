import { formatShortAddress } from '../';

test('formatShortAddress', () => {
  const shortAddress = formatShortAddress(
    '0xaa6f4c45251dB9565B1Fe4FEaB97453c66aCadDb'
  );
  expect(shortAddress).toBe('0xaa...adDb');
});
