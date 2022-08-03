import { createQROptions } from '@solana/pay';
import QRCodeStyling from '@solana/qr-code-styling';
import React, { FC, useEffect, useMemo, useRef, useState } from 'react';
import { useTheme } from 'styled-components';
import { usePayment } from '../hooks/usePayment';

export const QRCode: FC = () => {
  const theme = useTheme() as any;

  const [size, setSize] = useState(() =>
    typeof window === 'undefined'
      ? 400
      : Math.min(window.screen.availWidth - 48, 400)
  );
  useEffect(() => {
    const listener = () =>
      setSize(Math.min(window.screen.availWidth - 48, 400));

    window.addEventListener('resize', listener);
    return () => window.removeEventListener('resize', listener);
  }, []);

  const { url } = usePayment();
  const options = useMemo(
    () => createQROptions(url, size, 'transparent', theme.color.text),
    [url, size, theme.color.text]
  );

  const qr = useMemo(() => new QRCodeStyling(), []);
  useEffect(() => qr.update(options), [qr, options]);

  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (ref.current) {
      qr.append(ref.current);
    }
  }, [ref, qr]);

  return <div ref={ref} />;
};
