import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShareSquare,
  faCheckSquare,
} from "@fortawesome/free-regular-svg-icons";
import { formatDate } from "../utils/Formater";

const TrelloLabelColors = {
  green: "#59C059",
  yellow: "#C0C059",
  orange: "#C08C59",
  red: "#C05959",
  purple: "#8C59C0",
  blue: "#597BC0",
  sky: "#59C0C0",
  lime: "#8CC059",
  pink: "#C0598C",
  black: "#344563",
};

interface TrelloCardProps {
  card: any;
}

class TrelloCard extends Component<TrelloCardProps> {
  parseDate = (dateString: string) => {
    const date = new Date(Date.parse(dateString));
    return formatDate(date);
  };

  getDueDate = (card: any) => {
    if (card.due === null) return null;

    return <div className="trello-card-due">{this.parseDate(card.due)}</div>;
  };

  getChecklists = (card: any) => {
    if (card.checklists === undefined) return null;

    return (
      <div className="trello-card-checklists">
        {card.checklists.map((list: any) => {
          const items = list.checkItems;
          const completedItems = items.filter(
            (item: any) => item.state === "complete"
          );
          return (
            <div
              key={list.id}
              className={`trello-card-checklist ${
                items.length === completedItems.length ? "completed" : ""
              }`}
            >
              <FontAwesomeIcon className="icon" icon={faCheckSquare} />
              {`${completedItems.length}/${items.length}`}
            </div>
          );
        })}
      </div>
    );
  };

  getLabels = (card: any) => {
    const labels = card.labels as Array<any>;
    if (labels.length === 0) return null;

    return (
      <div className="trello-card-labels">
        {labels.map((label) => (
          <div
            key={label.id}
            className="trello-card-label"
            style={{
              color: "white",
              backgroundColor: (TrelloLabelColors as any)[label.color],
            }}
          >
            {label.name}
          </div>
        ))}
      </div>
    );
  };

  render() {
    const { card } = this.props;
    return (
      <div className="trello-card">
        {this.getLabels(card)}
        <div className="trello-card-content">
          <div className="trello-card-name">{card.name}</div>
          <div className="trello-card-actions">
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={card.shortUrl}
              className="trello-card-action-anchor"
              data-toggle="tooltip"
              data-placement="left"
              title="Open card on Trello"
            >
              <div className="trello-card-action">
                <FontAwesomeIcon icon={faShareSquare} />
              </div>
            </a>
          </div>
        </div>
        {this.getDueDate(card)}
        {this.getChecklists(card)}
      </div>
    );
  }
}

export default TrelloCard;
