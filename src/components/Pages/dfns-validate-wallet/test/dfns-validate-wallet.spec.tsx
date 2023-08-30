import { newSpecPage } from '@stencil/core/testing';
import { DfnsValidateWallet } from '../dfns-validate-wallet';

describe('dfns-validate-wallet', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [DfnsValidateWallet],
      html: `<dfns-validate-wallet></dfns-validate-wallet>`,
    });
    expect(page.root).toEqualHtml(`
      <dfns-validate-wallet>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </dfns-validate-wallet>
    `);
  });
});
