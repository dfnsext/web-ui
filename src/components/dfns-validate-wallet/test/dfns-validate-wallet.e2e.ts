import { newE2EPage } from '@stencil/core/testing';

describe('dfns-validate-wallet', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<dfns-validate-wallet></dfns-validate-wallet>');

    const element = await page.find('dfns-validate-wallet');
    expect(element).toHaveClass('hydrated');
  });
});
