import { newSpecPage } from '@stencil/core/testing';
import { DfnsWalletValidation } from '../dfns-wallet-validation';

describe('dfns-wallet-validation', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [DfnsWalletValidation],
      html: `<dfns-wallet-validation></dfns-wallet-validation>`,
    });
    expect(page.root).toEqualHtml(`
      <dfns-wallet-validation>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </dfns-wallet-validation>
    `);
  });
});
