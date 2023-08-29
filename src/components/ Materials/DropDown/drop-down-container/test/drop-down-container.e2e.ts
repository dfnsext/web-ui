import { newE2EPage } from '@stencil/core/testing';

describe('drop-down-container', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<drop-down-container></drop-down-container>');

    const element = await page.find('drop-down-container');
    expect(element).toHaveClass('hydrated');
  });
});
