export const primitives = {
  white: '#ffffff',
  black: '#0e0e0e',
};

export const sharedStyles = {
  borderWidth: '1px',
  borderRadius: {
    default: '12px',
    input: '4px',
  },
  font: {
    weight: {
      normal: '300',
      bold: '600',
    },
  },
  layout: {
    maxWidth: '1200px',
    mediumWidth: '600px',
    smallWidth: '400px',
    appLayoutPadding: '20px',
  },
  components: {
    modal: { animationDuration: 300 },
  },
  zIndex: {
    max: 9999,
  },
  products: {
    image: {
      aspectRatio: 1 / 1,
    },
  },
};

export const lightThemeSharedColors = {
  white: primitives.white,
  black: primitives.black,
  lightGrey: '#dddddd',
  text: primitives.black,
  background: primitives.white,
  danger: '#ff2626',
  lightText: `${primitives.black}cc`,
  backdrop: `${primitives.black}66`,
};

export const darkThemeSharedColors = {
  white: primitives.white,
  black: primitives.black,
  lightGrey: '#333333',
  text: primitives.white,
  danger: '#ff2626',
  lightText: `${primitives.white}cc`,
  backdrop: `${primitives.white}22`,
};
