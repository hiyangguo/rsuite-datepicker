import React from 'react';
import DatePicker from '../../src';


const DatePickerOnlyDate = props => (
  <div className="field only-date">
    <DatePicker
      dateFormat="YYYY-MM-DD"
    />
  </div>
);

export default DatePickerOnlyDate;

