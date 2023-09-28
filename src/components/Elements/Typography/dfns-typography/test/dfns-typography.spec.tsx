import { newSpecPage } from '@stencil/core/testing';
import { DfnsTypography } from '../dfns-typography';

describe('dfns-typography', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [DfnsTypography],
      html: `<dfns-typography></dfns-typography>`,
    });
    expect(page.root).toEqualHtml(`
      <dfns-typography>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </dfns-typography>
    `);
  });
});
