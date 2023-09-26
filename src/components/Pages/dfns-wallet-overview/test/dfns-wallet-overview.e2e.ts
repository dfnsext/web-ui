jest.useFakeTimers();
import { newE2EPage } from '@stencil/core/testing';

describe('dfns-wallet-overview', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<dfns-wallet-overview></dfns-wallet-overview>');

    const element = await page.find('dfns-wallet-overview');
    expect(element).toHaveClass('hydrated');
  });
});
