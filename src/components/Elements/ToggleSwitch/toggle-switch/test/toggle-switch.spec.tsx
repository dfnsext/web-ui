import { newSpecPage } from '@stencil/core/testing';
import { ToggleSwitch } from '../toggle-switch';

describe('toggle-switch', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ToggleSwitch],
      html: `<toggle-switch></toggle-switch>`,
    });
    expect(page.root).toEqualHtml(`
      <toggle-switch>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </toggle-switch>
    `);
  });
});
