import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import classNames from 'classnames';
import _ from 'lodash';
import MonthDropdown from './MonthDropdown';
import TimeDropdown from './TimeDropdown';
import MonthView from './MonthView';
import MonthHeader from './MonthHeader';
import WeekHeader from './WeekHeader';
import calendarPropTypes from '../calendarPropTypes';

const propTypes = {
  ...calendarPropTypes,
  calendarState: PropTypes.string,
  pageDate: PropTypes.instanceOf(moment),
  onMoveForword: PropTypes.func,
  onMoveBackward: PropTypes.func,
  onSelect: PropTypes.func,
  onToggleMonthDropdown: PropTypes.func,
  onToggleTimeDropdown: PropTypes.func,
  onChangePageDate: PropTypes.func,
  onChangePageTime: PropTypes.func,
  format: PropTypes.string
};


class Calendar extends React.Component {

  getTime() {
    const { format, pageDate } = this.props;
    let timeDate = pageDate || moment();
    let time = {};
    if (/(H|h)/.test(format)) {
      time.hours = timeDate.hours();
    }
    if (/m/.test(format)) {
      time.minutes = timeDate.minutes();
    }
    if (/s/.test(format)) {
      time.seconds = timeDate.seconds();
    }
    return time;
  }

  disabledDate = (date) => {
    const { disabledDate } = this.props;
    if (disabledDate && disabledDate(date)) {
      return true;
    }
    return false;
  }

  shouldMountTime(props) {
    const { format } = props || this.props;
    return /(H|h|m|s)/.test(format);
  }

  shouldMountMonth(props) {
    const { format } = props || this.props;
    return /Y/.test(format) && /M/.test(format);
  }

  shouldMountDate(props) {
    const { format } = props || this.props;
    return /Y/.test(format) && /M/.test(format) && /D/.test(format);
  }

  handleMoveForword = () => {
    const { onMoveForword, pageDate } = this.props;
    onMoveForword && onMoveForword(pageDate);
  }

  handleMoveBackward = () => {
    const { onMoveBackward, pageDate } = this.props;
    onMoveBackward && onMoveBackward(pageDate);
  }

  render() {

    const {
      calendarState,
      pageDate,
      onSelect,
      onToggleMonthDropdown,
      onToggleTimeDropdown,
      onChangePageDate,
      onChangePageTime,
      inline,
      ...props
    } = this.props;

    const time = this.getTime();
    const showDate = this.shouldMountDate();
    const showTime = this.shouldMountTime();
    const showMonth = this.shouldMountMonth();

    const onlyShowTime = showTime && !showDate && !showMonth;
    const onlyShowMonth = showMonth && !showDate && !showTime;
    const dropTime = calendarState === 'DROP_TIME' || onlyShowTime;
    const dropMonth = calendarState === 'DROP_MONTH' || onlyShowMonth;

    const calendarClasses = classNames('calendar', {
      'drop-time': dropTime,
      'drop-month': dropMonth,
      'sliding-left': calendarState === 'SLIDING_L',
      'sliding-right': calendarState === 'SLIDING_R'
    });

    const calendar = [
      <WeekHeader key={'WeekHeader'} />,
      <MonthView
        key={'MonthView'}
        activeDate={pageDate}
        onClick={onSelect}
        disabledDate={this.disabledDate}
      />
    ];

    return (
      <div className={calendarClasses}>
        <MonthHeader
          date={pageDate}
          time={time}
          showMonth={showMonth}
          showDate={showDate}
          showTime={showTime}
          onMoveForword={this.handleMoveForword}
          onMoveBackward={this.handleMoveBackward}
          onToggleMonthDropdown={onToggleMonthDropdown}
          onToggleTimeDropdown={onToggleTimeDropdown}
        />
        {showDate && calendar}
        {
          showMonth ? (
            <MonthDropdown
              date={pageDate}
              show={dropMonth}
              onClick={onChangePageDate}
            />
          ) : null
        }
        {
          showTime ? (
            <TimeDropdown
              {..._.pick(props, Object.keys(calendarPropTypes)) }
              date={pageDate}
              time={time}
              show={dropTime}
              onClick={onChangePageTime}
            />
          ) : null
        }

      </div>
    );
  }
}

Calendar.propTypes = propTypes;

export default Calendar;
