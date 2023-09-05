import { newE2EPage } from '@stencil/core/testing';

describe('dfns-stepper', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<dfns-stepper></dfns-stepper>');

    const element = await page.find('dfns-stepper');
    expect(element).toHaveClass('hydrated');
  });
});
