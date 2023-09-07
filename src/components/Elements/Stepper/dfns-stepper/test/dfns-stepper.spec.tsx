import { newSpecPage } from '@stencil/core/testing';
import { DfnsStepper } from '../dfns-stepper';

describe('dfns-stepper', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [DfnsStepper],
      html: `<dfns-stepper></dfns-stepper>`,
    });
    expect(page.root).toEqualHtml(`
      <dfns-stepper>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </dfns-stepper>
    `);
  });
});
