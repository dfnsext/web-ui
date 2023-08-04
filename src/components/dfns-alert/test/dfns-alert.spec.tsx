import { newSpecPage } from '@stencil/core/testing';
import { DfnsAlert } from '../dfns-alert';

describe('dfns-alert', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [DfnsAlert],
      html: `<dfns-alert></dfns-alert>`,
    });
    expect(page.root).toEqualHtml(`
      <dfns-alert>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </dfns-alert>
    `);
  });
});
