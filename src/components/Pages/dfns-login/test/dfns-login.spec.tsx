import { newSpecPage } from '@stencil/core/testing';
import { DfnsLogin } from '../dfns-login';

describe('dfns-login', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [DfnsLogin],
      html: `<dfns-login></dfns-login>`,
    });
    expect(page.root).toEqualHtml(`
      <dfns-login>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </dfns-login>
    `);
  });
});
