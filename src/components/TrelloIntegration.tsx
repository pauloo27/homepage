import React, { Component } from "react";
import "../styles/TrelloIntegration.scss";
import TrelloCard from "./TrelloCard";
import { faCog } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import TrelloSettings from "./TrelloSettings";
import FadeIn from "react-fade-in";
import { Lottie } from "@crello/react-lottie";
import loader from "../assets/loader.json";

interface TrelloIntegrationProps {
  apiKey: string;
  listId: string;
  onReady: Function;
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
        setTimeout(async () => {
          this.setState({ logged: true, cards });
          this.props.onReady();
        }, 1000);
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

    if (this.state.logged) {
      return (
        <div id="trello-cards-container">
          {this.state.cards.map(card => (
            <FadeIn key={card.id}>
              <TrelloCard card={card} />
            </FadeIn>
          ))}
        </div>
      );
    } else {
      return (
        <FadeIn>
          <div className="d-flex flex-column  align-items-center">
            <Lottie
              height="120px"
              width="120px"
              config={{ animationData: loader, loop: true, autoplay: true }}
            />
            <h5>Fetching Trello...</h5>
          </div>
        </FadeIn>
      );
    }
  };

  handleSave = (apiKey?: any, listId?: any) => {
    localStorage.setItem("trello-config", JSON.stringify({ apiKey, listId }));
  };

  render() {
    return (
      <div id="homepage-trello" className="homepage-card">
        <div className="homepage-card-header">
          <h4>Trello:</h4>
          <div
            data-toggle="tooltip"
            title="Setup Trello"
            className="homepage-card-settings-holder"
          >
            <div
              className="homepage-card-settings-holder"
              data-toggle="modal"
              data-target="#trello-settings-modal"
            >
              <FontAwesomeIcon
                icon={faCog}
                className="homepage-card-settings"
              />
            </div>
          </div>
        </div>
        <TrelloSettings
          apiKey={this.props.apiKey}
          listId={this.props.listId}
          onSave={this.handleSave}
          onReady={this.loadCards}
        />
        {this.showTrelloInfo()}
      </div>
    );
  }
}

export default TrelloIntegration;
