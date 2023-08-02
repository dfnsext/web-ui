import { Config } from '@stencil/core';
import { sass } from '@stencil/sass';

export const config: Config = {
  namespace: 'dfns-web-component',
  globalStyle: 'src/global/global.scss',
  outputTargets: [
    {
      type: 'dist',
      esmLoaderPath: '../loader',
    },
    {
      type: 'dist-custom-elements',
    },
    {
      type: 'docs-readme',
    },
    {
      type: 'www',
      serviceWorker: null, // disable service workers
    },
  ],
  plugins: [
    sass({
      injectGlobalPaths: [
        'src/themes/variables.scss',
        'src/themes/fonts.scss',
        'src/themes/modes.scss',
        'src/themes/constants.scss',
      ]
    })
  ],
  testing: {
    browserHeadless: "new",
  },
};
