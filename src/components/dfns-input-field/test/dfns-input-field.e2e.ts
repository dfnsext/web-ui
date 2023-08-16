import { newE2EPage } from '@stencil/core/testing';

describe('dfns-input-field', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<dfns-input-field></dfns-input-field>');

    const element = await page.find('dfns-input-field');
    expect(element).toHaveClass('hydrated');
  });
});
