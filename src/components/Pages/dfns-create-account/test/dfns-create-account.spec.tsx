import { newSpecPage } from '@stencil/core/testing';
import { DfnsCreateAccount } from '../dfns-create-account';

describe('dfns-create-account', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [DfnsCreateAccount],
      html: `<dfns-create-account></dfns-create-account>`,
    });
    expect(page.root).toEqualHtml(`
      <dfns-create-account>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </dfns-create-account>
    `);
  });
});
