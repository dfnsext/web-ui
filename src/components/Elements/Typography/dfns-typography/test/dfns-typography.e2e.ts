import { newE2EPage } from '@stencil/core/testing';

describe('dfns-typography', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<dfns-typography></dfns-typography>');

    const element = await page.find('dfns-typography');
    expect(element).toHaveClass('hydrated');
  });
});
