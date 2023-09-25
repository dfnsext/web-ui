import { newSpecPage } from '@stencil/core/testing';
import { DfnsTransferTokens } from '../dfns-transfer-tokens';

describe('dfns-transfer-tokens', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [DfnsTransferTokens],
      html: `<dfns-transfer-tokens></dfns-transfer-tokens>`,
    });
    expect(page.root).toEqualHtml(`
      <dfns-transfer-tokens>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </dfns-transfer-tokens>
    `);
  });
});
