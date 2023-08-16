import { newE2EPage } from '@stencil/core/testing';

describe('dfns-create-passkey', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<dfns-create-passkey></dfns-create-passkey>');

    const element = await page.find('dfns-create-passkey');
    expect(element).toHaveClass('hydrated');
  });
});
