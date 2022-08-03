import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle<{ theme: any }>`
  body {
    background: ${(p) => p.theme.color.background};
    color: ${(p) => p.theme.color.text};
  }

  ::selection {
    background: ${(p) => p.theme.color.primary};
    color: ${(p) => p.theme.color.white};
  }

  ::-moz-selection {
    background: ${(p) => p.theme.color.primary};
    color: ${(p) => p.theme.color.white};
  }

  /* This fixes the text color of the walletConnect modal (overridden by the color of the app body) */
  #walletconnect-wrapper {
    color: #000;
  }

  a {
    transition: 0.2s;
    color: ${(p) => p.theme.color.primary};
    text-decoration-color: ${(p) => p.theme.color.primary};
  }
`;
