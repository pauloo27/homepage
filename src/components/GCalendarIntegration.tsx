import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog } from "@fortawesome/free-solid-svg-icons";
import FadeIn from "react-fade-in";
import { Lottie } from "@crello/react-lottie";
import GCalendarSettings from "./GCalendarSettings";
import Clock from "./Clock";
import loader from "../assets/loader.json";
import "../styles/CalendarIntegration.scss";

interface GCalendarIntegrationState {
  /*
  -1 = not logged
  0 = loading
  1 = logged
  */
  loginState: number;
  events: Array<any>;
}

const weekDays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

class GCalendarIntegration extends Component<any, GCalendarIntegrationState> {
  state = { loginState: 0, events: new Array<any>() };

  colors: any = {};

  loadEvents = async (start: Date) => {
    const { gapi } = window as any;

    const end = new Date(start.getTime() + 30 * 24 * 60 * 60 * 1000);

    const events = new Array<any>();

    // resolve colors
    this.colors = (await gapi.client.calendar.colors.get()).result.calendar;

    // resolve the calendars
    const calendarsRes = await gapi.client.calendar.calendarList.list();
    // resolve the events for each calendar
    const promises = await (calendarsRes.result.items as Array<any>).map(
      async (calendar) => {
        const res = await gapi.client.calendar.events.list({
          calendarId: calendar.id,
          timeMin: start.toISOString(),
          timeMax: end.toISOString(),
          showDeleted: false,
          singleEvents: true,
          maxResults: 50,
          orderBy: "startTime",
        });
        events.push(
          ...res.result.items.map((event: any) => {
            event.calendar = calendar;
            event.colorId = calendar.colorId;
            let displayTime = "All day";
            if (event.start.date === undefined) {
              const eventStart = event.start.dateTime
                .split("T")[1]
                .substring(0, 5);
              const eventEnd = event.end.dateTime.split("T")[1].substring(0, 5);
              displayTime = `${eventStart} - ${eventEnd}`;
            }
            event.displayTime = displayTime;
            return event;
          })
        );
      }
    );

    await Promise.all(promises);

    await this.setState({ events });
  };

  getStatus = () => {
    if (this.state.loginState === -1)
      return <h4>Configure Google Calendar to see future events</h4>;
    return null;
  };

  handleLoginStatusChange = async (isSignedIn: boolean) => {
    if (isSignedIn) {
      await this.loadEvents(new Date());
    }
    this.setState({ loginState: isSignedIn ? 1 : -1 });
  };

  listEvents = () => {
    if (this.state.loginState === -1) return null;
    if (this.state.loginState === 0) {
      return (
        <FadeIn>
          <div className="d-flex flex-column  align-items-center">
            <Lottie
              height="120px"
              width="120px"
              config={{ animationData: loader, loop: true, autoplay: true }}
            />
            <h5 className="trello-status-text">Fetching Google Calendar...</h5>
          </div>
        </FadeIn>
      );
    }

    const eventsByDay = new Map<string, Array<any>>();

    this.state.events.forEach((event) => {
      let when = event.start.date;
      if (when === undefined) when = event.start.dateTime.split("T")[0];

      let events = new Array<any>();
      if (eventsByDay.has(when)) {
        events = eventsByDay.get(when)!;
      }
      events.push(event);
      eventsByDay.set(when, events);
    });

    // sort days
    const sorted = Array.from(eventsByDay.entries()).sort();

    const content = new Array<any>();
    content.push(<h5 key="header">Future events:</h5>);

    sorted.forEach((entry: Array<any>) => {
      const when = entry[0] as string;
      const weekDay = weekDays[new Date(when).getUTCDay()];
      let events = entry[1] as Array<any>;

      // sort events
      events = events.sort((a, b) => {
        if (a.displayTime === "All day") return -1;
        if (b.displayTime === "All day") return 1;

        if (a.displayTime < b.displayTime) return -1;
        if (a.displayTime > b.displayTime) return 1;
        return 0;
      });

      content.push(
        <FadeIn key={when}>
          <div className="gcalendar-events">
            <h6>{`${when} - ${weekDay}`}</h6>
            {events.map((event) => {
              const color = this.colors[event.colorId];
              return (
                <div
                  key={event.id}
                  style={{
                    backgroundColor: color.background,
                    color: color.foreground,
                  }}
                >
                  {`${event.displayTime}: ${event.summary}`}
                </div>
              );
            })}
          </div>
        </FadeIn>
      );
    });

    return content;
  };

  render() {
    return (
      <div id="calendar-container" className="homepage-card">
        <div className="homepage-card-header">
          <h4>Calendar:</h4>
          <div
            data-toggle="tooltip"
            title="Setup Google Calendar"
            className="homepage-card-settings-holder"
          >
            <div
              className="homepage-card-settings-holder"
              data-toggle="modal"
              data-target="#gcalendar-settings-modal"
            >
              <FontAwesomeIcon
                icon={faCog}
                className="homepage-card-settings"
              />
            </div>
          </div>
        </div>
        <Clock />
        {this.getStatus()}
        {this.listEvents()}
        <GCalendarSettings onLoginStatusChange={this.handleLoginStatusChange} />
      </div>
    );
  }
}

export default GCalendarIntegration;
