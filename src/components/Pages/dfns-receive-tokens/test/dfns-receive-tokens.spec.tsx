import { newSpecPage } from '@stencil/core/testing';
import { DfnsReceiveTokens } from '../dfns-receive-tokens';

describe('dfns-receive-tokens', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [DfnsReceiveTokens],
      html: `<dfns-receive-tokens></dfns-receive-tokens>`,
    });
    expect(page.root).toEqualHtml(`
      <dfns-receive-tokens>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </dfns-receive-tokens>
    `);
  });
});
