import { newSpecPage } from '@stencil/core/testing';
import { DfnsConfirmTransaction } from '../dfns-confirm-transaction';

describe('dfns-confirm-transaction', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [DfnsConfirmTransaction],
      html: `<dfns-confirm-transaction></dfns-confirm-transaction>`,
    });
    expect(page.root).toEqualHtml(`
      <dfns-confirm-transaction>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </dfns-confirm-transaction>
    `);
  });
});
