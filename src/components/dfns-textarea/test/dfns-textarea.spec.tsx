import { newSpecPage } from '@stencil/core/testing';
import { DfnsTextarea } from '../dfns-textarea';

describe('dfns-textarea', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [DfnsTextarea],
      html: `<dfns-textarea></dfns-textarea>`,
    });
    expect(page.root).toEqualHtml(`
      <dfns-textarea>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </dfns-textarea>
    `);
  });
});
