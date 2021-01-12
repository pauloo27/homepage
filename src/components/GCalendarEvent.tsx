import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShareSquare } from "@fortawesome/free-regular-svg-icons";

interface GCalendarEventProps {
  event: any;
  color: any;
}

export default function GCalendarEvent(props: GCalendarEventProps) {
  const { event, color } = props;
  return (
    <div className="gcalendar-event-container">
      <div
        style={{
          backgroundColor: color.background,
          color: color.foreground,
        }}
        className="gcalendar-event-info"
      >
        {`${event.displayTime}: ${event.summary}`}
      </div>
      <a
        className="gcalendar-event-link"
        target="_blank"
        rel="noopener noreferrer"
        href={event.link}
        data-toggle="tooltip"
        data-placement="left"
        title="See event in Google Calendar"
      >
        <FontAwesomeIcon icon={faShareSquare} />
      </a>
    </div>
  );
}
