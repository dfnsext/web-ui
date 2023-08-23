import { Config } from '@stencil/core';
import { sass } from '@stencil/sass';
import nodePolyfills from 'rollup-plugin-node-polyfills';
import dotenvPlugin from 'rollup-plugin-dotenv' 

export const config: Config = {
  namespace: 'dfns-web-component',
  globalStyle: 'src/global/global.scss',
  outputTargets: [
    {
      type: 'dist',
      esmLoaderPath: '../loader',
      isPrimaryPackageOutputTarget: true,
    },
    {
      type: 'docs-readme',
    },
    {
      type: 'www',
      serviceWorker: null, // disable service workers
    },
    {
      type: 'dist-custom-elements',
      copy: [
        {
          src: '**/*.{jpg,png,svg}',
          dest: 'dist/components/assets',
          warn: true,
        }
      ]
    }
  ],
  validatePrimaryPackageOutputTarget: true,
  plugins: [
    sass({
      injectGlobalPaths: [
        'src/themes/variables.scss',
        'src/themes/fonts.scss',
        'src/themes/modes.scss',
        'src/themes/constants.scss',
      ]
    }),
    dotenvPlugin()
  ],
  rollupPlugins: {
    after: [
      nodePolyfills(),
    ]
  },
  testing: {
    browserHeadless: "new",
  },
};

