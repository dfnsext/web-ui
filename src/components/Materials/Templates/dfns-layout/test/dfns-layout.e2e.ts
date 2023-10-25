jest.useFakeTimers();
import { newE2EPage } from '@stencil/core/testing';

describe('dfns-layout', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<dfns-layout></dfns-layout>');

    const element = await page.find('dfns-layout');
    expect(element).toHaveClass('hydrated');
  });
});
