import { getIsRunningOnBrowser } from '@kibalabs/core-react';
import { buildTheme, IBoxTheme, ITextTheme, ITheme, mergeTheme, mergeThemePartial } from '@kibalabs/ui-react';
import { transparentize } from 'polished';

export const buildAppTheme = (): ITheme => {
  const baseTheme = buildTheme();
  let brandPrimary = '#fff0ab';
  let brandSecondary = '#f29c13';
  let background = '#000000';
  let backgroundHighlight = '#231e00';
  let text = '#ffffff';
  let buttonPrimaryTextShadow = transparentize(0.25, brandPrimary);

  if (getIsRunningOnBrowser() && window.matchMedia && !window.matchMedia('(prefers-color-scheme: dark)').matches) {
    brandPrimary = '#927700';
    brandSecondary = '#593802';
    background = '#ffffff';
    backgroundHighlight = '#fff6c4';
    text = '#555555';
    buttonPrimaryTextShadow = transparentize(0.9, brandPrimary);
  }

  const theme = buildTheme({
    colors: {
      brandPrimary,
      brandSecondary,
      tabSelectedBackground: transparentize(0.8, brandPrimary),
      background,
      backgroundHighlight,
      text,
      buttonPrimaryTextShadow,
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
      topBar: {
        'border-width': '0',
        'background-color': transparentize(0.8, background),
        padding: `${baseTheme.dimensions.paddingNarrow2} ${baseTheme.dimensions.padding}`,
      },
    },
  });
  return theme;
};
