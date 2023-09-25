import { newE2EPage } from '@stencil/core/testing';

describe('dfns-confirm-transaction', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<dfns-confirm-transaction></dfns-confirm-transaction>');

    const element = await page.find('dfns-confirm-transaction');
    expect(element).toHaveClass('hydrated');
  });
});
