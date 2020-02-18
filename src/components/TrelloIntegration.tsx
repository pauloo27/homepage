import React, { Component } from "react";
import "../styles/TrelloIntegration.scss";
import TrelloCard from "./TrelloCard";
import { faCog } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import TrelloSettings from "./TrelloSettings";

interface TrelloIntegrationProps {
  apiKey: string;
  listId: string;
  onSettingsChange: Function;
}

interface TrelloIntegrationState {
  logged: boolean;
  cards: Array<any>;
}

class TrelloIntegration extends Component<
  TrelloIntegrationProps,
  TrelloIntegrationState
> {
  state = { logged: false, cards: new Array<any>() };

  loadCards = (trello: any) => {
    if (this.state.logged) return;
    trello.get(
      `lists/${this.props.listId}/cards`,
      (res: any) => {
        console.log("get cards");
        const cards = res;
        this.setState({ logged: true, cards });
      },
      (err: any) => {
        console.log("ERROR:", err);
      }
    );
  };

  showTrelloInfo = () => {
    if (
      this.props.apiKey.trim().length === 0 ||
      this.props.listId.trim().length === 0
    )
      return <h6>Setup Trello config to start using</h6>;

    return (
      <div id="trello-cards-container">
        {this.state.cards.map(card => (
          <TrelloCard key={card.id} card={card} />
        ))}
      </div>
    );
  };

  render() {
    return (
      <div id="homepage-trello" className="homepage-card">
        <div className="homepage-card-header">
          <h4>Trello:</h4>
          <div
            className="homepage-card-settings-holder"
            data-toggle="modal"
            data-target="#trello-settings-modal"
          >
            <FontAwesomeIcon icon={faCog} className="homepage-card-settings" />
          </div>
        </div>
        <TrelloSettings
          apiKey={this.props.apiKey}
          listId={this.props.listId}
          onSave={this.props.onSettingsChange}
          onReady={this.loadCards}
        />
        {this.showTrelloInfo()}
      </div>
    );
  }
}

export default TrelloIntegration;
