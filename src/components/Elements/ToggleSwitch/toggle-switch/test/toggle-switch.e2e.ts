jest.useFakeTimers();
import { newE2EPage } from '@stencil/core/testing';

describe('toggle-switch', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<toggle-switch></toggle-switch>');

    const element = await page.find('toggle-switch');
    expect(element).toHaveClass('hydrated');
  });
});
