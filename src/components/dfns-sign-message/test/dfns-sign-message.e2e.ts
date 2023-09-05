import { newE2EPage } from '@stencil/core/testing';

describe('dfns-sign-message', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<dfns-sign-message></dfns-sign-message>');

    const element = await page.find('dfns-sign-message');
    expect(element).toHaveClass('hydrated');
  });
});
