import { newE2EPage } from '@stencil/core/testing';

describe('dfns-receive-tokens', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<dfns-receive-tokens></dfns-receive-tokens>');

    const element = await page.find('dfns-receive-tokens');
    expect(element).toHaveClass('hydrated');
  });
});
