import { newSpecPage } from '@stencil/core/testing';
import { DfnsSettings } from '../dfns-settings';

describe('dfns-settings', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [DfnsSettings],
      html: `<dfns-settings></dfns-settings>`,
    });
    expect(page.root).toEqualHtml(`
      <dfns-settings>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </dfns-settings>
    `);
  });
});
