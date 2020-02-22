import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShareSquare } from "@fortawesome/free-regular-svg-icons";
import { withLeadingZeroes } from "../utils/Formater";

const TrelloLabelColors = {
  green: "#61bd4f",
  yellow: "#f2d600",
  orange: "#ff9f1a",
  red: "#eb5a46",
  purple: "#c377e0",
  blue: "#0079bf",
  sky: "#00c2e0",
  lime: "#51e898",
  pink: "#ff78cb",
  black: "#344563"
};

interface TrelloCardProps {
  card: any;
}

class TrelloCard extends Component<TrelloCardProps> {
  parseDate = (dateString: string) => {
    const date = new Date(Date.parse(dateString));
    return `${date.getFullYear()}/${withLeadingZeroes(
      date.getMonth() + 1,
      2
    )}/${withLeadingZeroes(date.getDate(), 2)}`;
  };

  getDueDate = (card: any) => {
    if (card.due === null) return null;

    return <div className="trello-card-due">{this.parseDate(card.due)}</div>;
  };

  getLabels = (card: any) => {
    const labels = card.labels as Array<any>;
    if (labels.length === 0) return null;

    return (
      <div className="trello-card-labels">
        {labels.map(label => (
          <div
            className="trello-card-label"
            style={{ backgroundColor: (TrelloLabelColors as any)[label.color] }}
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
              href={this.props.card.shortUrl}
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
      </div>
    );
  }
}

export default TrelloCard;
