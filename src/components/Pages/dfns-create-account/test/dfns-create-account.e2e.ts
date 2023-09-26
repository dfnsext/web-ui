jest.useFakeTimers();
import { newE2EPage } from '@stencil/core/testing';

describe('dfns-create-account', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<dfns-create-account></dfns-create-account>');

    const element = await page.find('dfns-create-account');
    expect(element).toHaveClass('hydrated');
  });
});
