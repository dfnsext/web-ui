import { newSpecPage } from '@stencil/core/testing';
import { DfnsDesignSystem } from '../dfns-design-system';

describe('dfns-design-system', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [DfnsDesignSystem],
      html: `<dfns-design-system></dfns-design-system>`,
    });
    expect(page.root).toEqualHtml(`
      <dfns-design-system>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </dfns-design-system>
    `);
  });
});
