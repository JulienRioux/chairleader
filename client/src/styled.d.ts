// import original module declarations
import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    borderRadius: {
      default: string;
      input: string;
    };
    font: {
      weight: {
        normal: string;
        bold: string;
      };
    };
    borderWidth: string;
    color: {
      primary: string;
      white: string;
      black: string;
      lightGrey: string;
      text: string;
      background: string;
      danger: string;
      lightText: string;
      backdrop: string;
      buttonText: string;
    };
    layout: {
      maxWidth: string;
      mediumWidth: string;
      smallWidth: string;
      appLayoutPadding: string;
    };
    components: {
      modal: { animationDuration: number };
    };
    zIndex: {
      max: number;
    };
    products: {
      image: {
        // aspectRatio: 3 / 2,
        aspectRatio: number;
      };
    };
  }
}
