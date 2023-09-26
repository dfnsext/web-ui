jest.useFakeTimers();
import { newE2EPage } from '@stencil/core/testing';

describe('dfns-button', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<dfns-button></dfns-button>');

    const element = await page.find('dfns-button');
    expect(element).toHaveClass('hydrated');
  });
});
