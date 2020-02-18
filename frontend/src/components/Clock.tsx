import React, { Component } from "react";
import { withLeadingZeroes as pad } from "../utils/Formater";

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
    const hour = `${pad(date.getHours(), 2)}:${pad(date.getMinutes(), 2)}:${pad(
      date.getSeconds(),
      2
    )}`;
    return <h3 id="calendar-clock">{hour}</h3>;
  }
}

export default Clock;
