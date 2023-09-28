import { newE2EPage } from '@stencil/core/testing';

describe('dfns-recover-account', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<dfns-recover-account></dfns-recover-account>');

    const element = await page.find('dfns-recover-account');
    expect(element).toHaveClass('hydrated');
  });
});
