import { newSpecPage } from '@stencil/core/testing';
import { DfnsWalletOverview } from '../dfns-wallet-overview';

describe('dfns-wallet-overview', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [DfnsWalletOverview],
      html: `<dfns-wallet-overview></dfns-wallet-overview>`,
    });
    expect(page.root).toEqualHtml(`
      <dfns-wallet-overview>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </dfns-wallet-overview>
    `);
  });
});
