import { newSpecPage } from '@stencil/core/testing';
import { DfnsInputField } from '../dfns-input-field';

describe('dfns-input-field', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [DfnsInputField],
      html: `<dfns-input-field></dfns-input-field>`,
    });
    expect(page.root).toEqualHtml(`
      <dfns-input-field>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </dfns-input-field>
    `);
  });
});
