import { newSpecPage } from '@stencil/core/testing';
import { DfnsRecoverySetup } from '../dfns-recovery-setup';

describe('dfns-recovery-setup', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [DfnsRecoverySetup],
      html: `<dfns-recovery-setup></dfns-recovery-setup>`,
    });
    expect(page.root).toEqualHtml(`
      <dfns-recovery-setup>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </dfns-recovery-setup>
    `);
  });
});
