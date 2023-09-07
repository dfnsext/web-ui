import { newSpecPage } from '@stencil/core/testing';
import { DfnsButton } from '../dfns-button';

describe('dfns-button', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [DfnsButton],
      html: `<dfns-button></dfns-button>`,
    });
    expect(page.root).toEqualHtml(`
      <dfns-button>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </dfns-button>
    `);
  });
});
