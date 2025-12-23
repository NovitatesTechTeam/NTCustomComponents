// import { expect, test } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import { composeStories } from '@storybook/react';
import '@testing-library/jest-dom';

import * as DemoStories from './demo.stories';

const { BaseNovitatesMyDxExtensionsBooleanToggle } = composeStories(DemoStories);

test('renders NovitatesMyDxExtensionsBooleanToggle', async () => {
  render(<BaseNovitatesMyDxExtensionsBooleanToggle />);
  expect(await screen.findByText('TextInput Sample')).toBeVisible();
  expect(await screen.findByText('TextInput Helper Text')).toBeVisible();


  const textInputElement = (screen.getByTestId('TextInput-12345678') as HTMLInputElement);
  expect(textInputElement.value).toBe('');

  expect(textInputElement).toHaveAttribute('placeholder', 'TextInput Placeholder');
});
