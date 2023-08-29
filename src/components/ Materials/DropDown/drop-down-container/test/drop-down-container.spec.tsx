import { newSpecPage } from '@stencil/core/testing';
import { DropDownContainer } from '../drop-down-container';

describe('drop-down-container', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [DropDownContainer],
      html: `<drop-down-container></drop-down-container>`,
    });
    expect(page.root).toEqualHtml(`
      <drop-down-container>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </drop-down-container>
    `);
  });
});
