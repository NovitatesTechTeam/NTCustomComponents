// import { expect, test } from '@jest/globals';
import { fireEvent, render, screen } from '@testing-library/react';
import { composeStories } from '@storybook/react';
import '@testing-library/jest-dom';

import * as DemoStories from './demo.stories';



const { BaseNovitatesNtdxComponentsSmartBanner } = composeStories(DemoStories);

test('renders NovitatesNtdxComponentsSmartBanner', async () => {
  render(<BaseNovitatesNtdxComponentsSmartBanner />);
  expect(await screen.findByText('Create operator')).toBeVisible();
  // expect(await screen.findByText('last year')).toBeVisible();

  const frenchBefore = screen.queryByText('french DigV2');
  expect(frenchBefore).not.toBeInTheDocument();

  // admin button
  const adminButton = screen.getByRole('button');
  fireEvent.click(adminButton);

  const frenchArr = await screen.findAllByText('french DigV2');
  expect(frenchArr[0]).toBeVisible();
  expect(frenchArr[1]).toBeVisible();


});
