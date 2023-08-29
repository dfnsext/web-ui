import { newE2EPage } from '@stencil/core/testing';

describe('dfns-settings', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<dfns-settings></dfns-settings>');

    const element = await page.find('dfns-settings');
    expect(element).toHaveClass('hydrated');
  });
});
