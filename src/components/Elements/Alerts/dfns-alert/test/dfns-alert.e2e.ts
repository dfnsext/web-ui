jest.useFakeTimers();
import { newE2EPage } from '@stencil/core/testing';

describe('dfns-alert', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<dfns-alert></dfns-alert>');

    const element = await page.find('dfns-alert');
    expect(element).toHaveClass('hydrated');
  });
});
