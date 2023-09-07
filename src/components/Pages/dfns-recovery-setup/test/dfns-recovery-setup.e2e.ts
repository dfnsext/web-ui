import { newE2EPage } from '@stencil/core/testing';

describe('dfns-recovery-setup', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<dfns-recovery-setup></dfns-recovery-setup>');

    const element = await page.find('dfns-recovery-setup');
    expect(element).toHaveClass('hydrated');
  });
});
