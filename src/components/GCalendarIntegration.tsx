import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog, faSync } from "@fortawesome/free-solid-svg-icons";
import FadeIn from "react-fade-in";
import { Lottie } from "@crello/react-lottie";
import { formatTime } from '../utils/Formater';
import GCalendarSettings from "./GCalendarSettings";
import Clock from "./Clock";
import Weather from "./Weather";
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
  showWeather: boolean;
  cache: any;
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
  state = { loginState: 0, events: new Array<any>(), showWeather: true, cache: undefined };

  colors: any = {};

  componentDidMount() {
    const showWeather = localStorage.getItem("show-weather");
    if (showWeather !== null) {
      this.setState(JSON.parse(showWeather));
    }
    this.loadEvents(new Date());
  }
  
  loadEvents = async (now: Date) => {
    const cachedInfo = localStorage.getItem("gcalendar-cached");
    if(cachedInfo === null) {
      console.log("No calendar cache found");
      return;
    }

    // eslint-disable-next-line
    let {date, events, colors} = JSON.parse(cachedInfo);

    events = events.filter((event: any) => {
      const {end} = event;
      let endDate: Date | undefined;

      if (end.date !== undefined) {
        endDate = new Date(`${end.date}T00:00:00`);
      } else {
        endDate = new Date(end.dateTime);
      }
      return endDate.getTime() > now.getTime();
    });

    let old = false;

    if(now.getTime() - date >= 15 * 60 * 1000) {
      console.log("Calendar cache too old...");
      old = true;
    }

    this.colors = colors;
    this.setState({ events, cache: {date, old} });
  }

  loadEventsFromGoogle = async (timeMin: Date) => {
    const { gapi } = window as any;

    const timeMax = new Date(timeMin.getTime() + 7 * 24 * 60 * 60 * 1000);

    const events = new Array<any>();

    // resolve colors
    this.colors = (await gapi.client.calendar.colors.get()).result.calendar;

    // resolve the calendars
    const calendarsRes = await gapi.client.calendar.calendarList.list();
    // resolve the events for each calendar
    const promises = (calendarsRes.result.items as Array<any>).map(
      async (calendar) => {
        const res = await gapi.client.calendar.events.list({
          calendarId: calendar.id,
          timeMin: timeMin.toISOString(),
          timeMax: timeMax.toISOString(),
          showDeleted: false,
          singleEvents: true,
          maxResults: 50,
          orderBy: "startTime",
        });
        events.push(
          ...res.result.items.map((event: any) => {
            let displayTime = "All day";
            if (event.start.date === undefined) {
              const eventStart = event.start.dateTime
                .split("T")[1]
                .substring(0, 5);
              const eventEnd = event.end.dateTime.split("T")[1].substring(0, 5);
              displayTime = `${eventStart} - ${ eventEnd}`;
            }
            const {id, start, end, summary} = event;
            return {id, displayTime, start, end, summary, colorId: calendar.colorId};
          })
        );
      }
    );

    await Promise.all(promises);

    localStorage.setItem("gcalendar-cached", JSON.stringify({date: new Date().getTime(), events, colors: this.colors}));
    this.setState({ events, cache: undefined });
  };

  getStatus = () => {
    if (this.state.loginState === -1)
      return <h4>Configure Google Calendar to see future events</h4>;
    return null;
  };

  handleLoginStatusChange = async (isSignedIn: boolean) => {
    const cache = this.state.cache as unknown as undefined | any;
    if (isSignedIn && (cache === undefined || cache.old)) {
      await this.loadEventsFromGoogle(new Date());
    }
    this.setState({ loginState: isSignedIn ? 1 : -1 });
  };

  forceUpdate = () => {
    if (this.state.loginState === 1) {
      this.setState((prev) => ({cache: {date: prev.cache.date, old: true }}), () => {
        this.loadEventsFromGoogle(new Date());
      });
    }
  }

  listEvents = () => {
    if (this.state.loginState === -1) return null;
    if (this.state.loginState === 0 && !this.state.cache) {
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
      // eslint-disable-next-line
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

    if (this.state.cache !== undefined) {
      const cache = this.state.cache as unknown as any; 
      const display = formatTime(new Date(cache.date));

      content.push(
        <div id="cache-status-container" key="cache-status">
          <h6>Updated at {display}. {cache.old ? 'Updating...' : ''}</h6>
          {cache.old || this.state.loginState !== 1 ? null : (
            <div title="Update now" id="refresh-cache-button" onClick={this.forceUpdate}>
              <FontAwesomeIcon icon={faSync} />
            </div>
          )}
        </div>
      );
    }

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

  handleSave = (config: any) => {
    this.setState(config);
  }

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
        {this.state.showWeather ? <Weather /> : null}
        <Clock />
        {this.getStatus()}
        {this.listEvents()}
        <GCalendarSettings 
          showWeather={this.state.showWeather} 
          onSave={this.handleSave}
          onLoginStatusChange={this.handleLoginStatusChange} 
        />
      </div>
    );
  }
}

export default GCalendarIntegration;
