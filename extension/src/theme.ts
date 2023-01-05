import { buildTheme, ITheme } from '@kibalabs/ui-react';
import { transparentize } from 'polished';

export const buildAppTheme = (): ITheme => {
  const baseTheme = buildTheme();
  let brandPrimary = '#ffffff';
  let brandSecondary = '#000000';
  let background = '#0074D9';
  let backgroundHighlight = '#231e00';
  let text = '#ffffff';

  const theme = buildTheme({
    colors: {
      brandPrimary,
      brandSecondary,
      background,
      backgroundHighlight,
      text,
    },
    icons: {
      small: {
        size: '0.6em',
      },
      small2: {
        size: '0.5em',
      },
    },
    loadingSpinners: {
      small: {
        size: '0.75rem',
        width: '0.1rem',
      },
    },
    boxes: {
      infoBar: {
        'border-width': '0',
        'background-color': '$colors.backgroundClear10',
        padding: `${baseTheme.dimensions.paddingNarrow2} ${baseTheme.dimensions.padding}`,
        'border-radius': `${baseTheme.dimensions.borderRadius} 0 0 0`,
      },
    },
  });
  return theme;
};
