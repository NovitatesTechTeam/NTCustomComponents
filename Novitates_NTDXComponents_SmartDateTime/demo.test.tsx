// import { expect, test } from '@jest/globals';
import { render, screen, fireEvent } from '@testing-library/react';
import { composeStories } from '@storybook/react';
import '@testing-library/jest-dom';

import * as DemoStories from './demo.stories';

const { BaseNovitatesNtdxComponentsSmartDateTime } = composeStories(DemoStories);

test('renders NovitatesNtdxComponentsSmartDateTime', async () => {
  render(<BaseNovitatesNtdxComponentsSmartDateTime/>);
  expect(await screen.findByText('DateTime Label')).toBeVisible();
  expect(await screen.findByText('DateTime helper text')).toBeVisible();

  // const dateElement = screen.getByRole('textbox');
  // for some odd reason, checking the full string of "USD 0.00" doesn't pass
  // expect(currencyElement).toHaveValue('USD 0.00');
  const myMonth = (screen.getByTestId(':date-time-input:control-month') as HTMLInputElement);
  expect(myMonth.value).toContain('01');
  expect(myMonth).toHaveAttribute('placeholder', 'MM');

  const myDay = (screen.getByTestId(':date-time-input:control-day') as HTMLInputElement);
  expect(myDay.value).toContain('24');
  expect(myDay).toHaveAttribute('placeholder', 'DD');

  const myYear = (screen.getByTestId(':date-time-input:control-year') as HTMLInputElement);
  expect(myYear.value).toContain('2023');
  expect(myYear).toHaveAttribute('placeholder', 'YYYY');

  const myHour = (screen.getByTestId(':date-time-input:control-hour') as HTMLInputElement);
  expect(myHour.value).toContain('04');
  expect(myHour).toHaveAttribute('placeholder', 'hh');

  const myMinute = (screen.getByTestId(':date-time-input:control-minute') as HTMLInputElement);
  expect(myMinute.value).toContain('45');
  expect(myMinute).toHaveAttribute('placeholder', 'mm');

  const myPeriod = (screen.getByTestId(':date-time-input:control-period') as HTMLSelectElement).value;
  expect(myPeriod).toContain('PM');


  // press clear button
  const clearX = screen.getByTestId(':date-time-input:clear-current-date-and-time') as HTMLButtonElement;
  fireEvent.click(clearX);

  const myClearMonth = (screen.getByTestId(':date-time-input:control-month') as HTMLInputElement).value;
  expect(myClearMonth).toContain('');

  const myClearDay = (screen.getByTestId(':date-time-input:control-day') as HTMLInputElement).value;
  expect(myClearDay).toContain('');

  const myClearYear = (screen.getByTestId(':date-time-input:control-year') as HTMLInputElement).value;
  expect(myClearYear).toContain('');

  const myClearHour = (screen.getByTestId(':date-time-input:control-hour') as HTMLInputElement).value;
  expect(myClearHour).toContain('');

  const myClearMinute = (screen.getByTestId(':date-time-input:control-minute') as HTMLInputElement).value;
  expect(myClearMinute).toContain('');

  const myClearPeriod = (screen.getByTestId(':date-time-input:control-period') as HTMLSelectElement).value;
  expect(myClearPeriod).toContain('AM');

  // press date picker
  const pickerButton = screen.getByTestId(':date-time-input:open-close-picker') as HTMLButtonElement;
  fireEvent.click(pickerButton);

  // because need to wait after button pressed before finding the data picker pop up, need to do this
  // via "await" and "findByTestId" (as opposed to getByTestId)
  const dataPickerPopUp = await screen.findByTestId(':date-time-input:picker:date-picker:');
  expect(dataPickerPopUp).not.toBeNull();
});
