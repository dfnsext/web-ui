jest.useFakeTimers();
import { newE2EPage } from '@stencil/core/testing';

describe('dfns-wallet-validation', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<dfns-wallet-validation></dfns-wallet-validation>');

    const element = await page.find('dfns-wallet-validation');
    expect(element).toHaveClass('hydrated');
  });
});
