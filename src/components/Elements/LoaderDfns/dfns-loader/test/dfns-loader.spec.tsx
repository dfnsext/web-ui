import { newSpecPage } from '@stencil/core/testing';
import { DfnsLoader } from '../dfns-loader';

describe('dfns-loader', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [DfnsLoader],
      html: `<dfns-loader></dfns-loader>`,
    });
    expect(page.root).toEqualHtml(`
      <dfns-loader>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </dfns-loader>
    `);
  });
});
