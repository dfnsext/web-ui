import { newE2EPage } from '@stencil/core/testing';

describe('dfns-design-system', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<dfns-design-system></dfns-design-system>');

    const element = await page.find('dfns-design-system');
    expect(element).toHaveClass('hydrated');
  });
});
