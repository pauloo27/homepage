import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShareSquare } from "@fortawesome/free-regular-svg-icons";
import { withLeadingZeroes } from "../utils/Formater";

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

  render() {
    const { card } = this.props;
    return (
      <div className="trello-card">
        <div className="trello-card-content">
          <div className="trello-card-name">{card.name}</div>
          <div className="trello-card-actions">
            <a
              target="blank"
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
        {card.due === null ? (
          ""
        ) : (
          <div className="trello-card-due">{this.parseDate(card.due)}</div>
        )}
      </div>
    );
  }
}

export default TrelloCard;
