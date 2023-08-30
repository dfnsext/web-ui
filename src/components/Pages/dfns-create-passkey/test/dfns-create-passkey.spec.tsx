import { newSpecPage } from '@stencil/core/testing';
import { DfnsCreatePasskey } from '../dfns-create-passkey';

describe('dfns-create-passkey', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [DfnsCreatePasskey],
      html: `<dfns-create-passkey></dfns-create-passkey>`,
    });
    expect(page.root).toEqualHtml(`
      <dfns-create-passkey>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </dfns-create-passkey>
    `);
  });
});
