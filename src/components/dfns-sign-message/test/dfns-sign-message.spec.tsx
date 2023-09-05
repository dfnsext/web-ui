import { newSpecPage } from '@stencil/core/testing';
import { DfnsSignMessage } from '../dfns-sign-message';

describe('dfns-sign-message', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [DfnsSignMessage],
      html: `<dfns-sign-message></dfns-sign-message>`,
    });
    expect(page.root).toEqualHtml(`
      <dfns-sign-message>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </dfns-sign-message>
    `);
  });
});
