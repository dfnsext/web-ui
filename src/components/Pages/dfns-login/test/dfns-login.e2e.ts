jest.useFakeTimers();
import { newE2EPage } from '@stencil/core/testing';

describe('dfns-login', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<dfns-login></dfns-login>');

    const element = await page.find('dfns-login');
    expect(element).toHaveClass('hydrated');
  });
});
