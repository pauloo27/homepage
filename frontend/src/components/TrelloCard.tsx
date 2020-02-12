import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShareSquare } from "@fortawesome/free-regular-svg-icons";

interface TrelloCardProps {
  card: any;
}

class TrelloCard extends Component<TrelloCardProps> {
  parseDate = (dateString: string) => {
    const date = new Date(Date.parse(dateString));

    const pad = (number: number, size: number) => {
      let str = number.toString();

      while (str.length < size) {
        str = "0" + str;
      }
      return str;
    };

    return `${date.getFullYear()}/${pad(date.getMonth() + 1, 2)}/${pad(
      date.getDate(),
      2
    )}`;
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
