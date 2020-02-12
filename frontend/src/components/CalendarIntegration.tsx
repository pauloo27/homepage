import React, { Component } from "react";
import Calendar from "react-calendar";
import "../styles/CalendarIntegration.scss";

class CalendarIntegration extends Component {
  render() {
    return (
      <div id="calendar-container" className="homepage-card">
        <h4>Google Calendar:</h4>
        <Calendar
          locale="en-US"
          value={new Date()}
          className="homepage-calendar"
        />
      </div>
    );
  }
}

export default CalendarIntegration;
