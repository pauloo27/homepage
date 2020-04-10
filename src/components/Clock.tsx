import React, { Component } from 'react';
import { formatDate, withLeadingZeroes as pad } from '../utils/Formater';

interface ClockState {
  date: Date;
}

class Clock extends Component<any, ClockState> {
  state = { date: new Date() };

  timerId?: any;

  componentDidMount() {
    this.timerId = setInterval(() => this.setState({ date: new Date() }), 1000);
  }

  componentWillUnmount() {
    clearInterval(this.timerId);
  }

  render() {
    const { date } = this.state;
    const hours = pad(date.getHours(), 2);
    const minutes = pad(date.getMinutes(), 2);
    const seconds = pad(date.getSeconds(), 2);
    return (
      <>
        <h6 id="calendar-today">{formatDate(date)}</h6>
        <h3 id="calendar-clock">{`${hours}:${minutes}:${seconds}`}</h3>
      </>
    );
  }
}

export default Clock;
