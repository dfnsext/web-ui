import { newE2EPage } from '@stencil/core/testing';

describe('dfns-transfer-tokens', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<dfns-transfer-tokens></dfns-transfer-tokens>');

    const element = await page.find('dfns-transfer-tokens');
    expect(element).toHaveClass('hydrated');
  });
});
