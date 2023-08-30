import { newE2EPage } from '@stencil/core/testing';

describe('dfns-loader', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<dfns-loader></dfns-loader>');

    const element = await page.find('dfns-loader');
    expect(element).toHaveClass('hydrated');
  });
});
