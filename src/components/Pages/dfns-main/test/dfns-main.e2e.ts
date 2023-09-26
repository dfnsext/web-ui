jest.useFakeTimers();
import { newE2EPage } from '@stencil/core/testing';

describe('dfns-main', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<dfns-main></dfns-main>');

    const element = await page.find('dfns-main');
    expect(element).toHaveClass('hydrated');
  });
});
