import { newE2EPage } from '@stencil/core/testing';

describe('dfns-textarea', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<dfns-textarea></dfns-textarea>');

    const element = await page.find('dfns-textarea');
    expect(element).toHaveClass('hydrated');
  });
});
