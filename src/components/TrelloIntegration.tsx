import React, { Component } from "react";
import "../styles/TrelloIntegration.scss";
import TrelloCard from "./TrelloCard";
import {
  faCog,
  faTimes,
  faAngleLeft,
  faAngleRight
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import TrelloSettings from "./TrelloSettings";
import FadeIn from "react-fade-in";
import { Lottie } from "@crello/react-lottie";
import loader from "../assets/loader.json";
import checked from "../assets/checked.json";

interface TrelloIntegrationProps {
  apiKey: string;
  onReady: Function;
}

interface TrelloIntegrationState {
  logged: boolean;
  trello: any;
  cards?: Array<any>;
  boards: Array<any>;
  lists: Array<any>;
  selectedList: any;
  selectedBoard: any;
  /* 
  -1 = refreshing
  0 = loading
  1 = done
  */
  status: number;
}

class TrelloIntegration extends Component<
  TrelloIntegrationProps,
  TrelloIntegrationState
> {
  state = {
    logged: false,
    trello: {} as any,
    status: 0,
    selectedList: {} as any,
    selectedBoard: {} as any,
    cards: new Array<any>(),
    boards: new Array<any>(),
    lists: new Array<any>()
  };

  saveHistory = () => {
    localStorage.setItem(
      "trello-history",
      JSON.stringify({
        selectedList: this.state.selectedList.id,
        selectedBoard: this.state.selectedBoard.id
      })
    );
  };

  loadBoards = async (trello: any) => {
    trello.get(
      "members/me/boards",
      async (res: any) => {
        console.log("get boards");
        await this.setState({ boards: res });
        this.loadLists(trello);
      },
      (err: any) => {
        console.log(err);
      }
    );
  };

  loadLists = (trello: any) => {
    let boardId = this.state.selectedBoard.id;
    if (boardId === undefined) {
      const history = localStorage.getItem("trello-history");
      if (this.state.status === 0 && history !== null) {
        const json = JSON.parse(history);
        if (json.selectedBoard === undefined) {
          boardId = this.state.boards[0].id;
          this.setState({ selectedBoard: this.state.boards[0] });
        } else {
          boardId = json.selectedBoard;
          this.setState({
            selectedBoard: this.state.boards.find(
              board => board.id === json.selectedBoard
            )
          });
        }
      } else {
        boardId = this.state.boards[0].id;
        this.setState({ selectedBoard: this.state.boards[0] });
      }
    }
    trello.get(
      `boards/${boardId}/lists`,
      async (res: any) => {
        console.log("get lists");
        await this.setState({ lists: res });
        this.loadCards(trello);
      },
      (err: any) => {
        console.log(err);
      }
    );
  };

  loadCards = (trello: any) => {
    let listId = this.state.selectedList.id;
    if (listId === undefined) {
      const history = localStorage.getItem("trello-history");
      if (this.state.status === 0 && history !== null) {
        const json = JSON.parse(history);
        if (json.selectedList === undefined) {
          listId = this.state.lists[0].id;
          this.setState({ selectedList: this.state.lists[0] });
        } else {
          listId = json.selectedList;
          this.setState({
            selectedList: this.state.lists.find(
              list => list.id === json.selectedList
            )
          });
        }
      } else {
        listId = this.state.lists[0].id;
        this.setState({ selectedList: this.state.lists[0] });
      }
    }
    trello.get(
      `lists/${listId}/cards`,
      (res: any) => {
        console.log("get cards");
        const cards = res;
        this.setState({ cards, status: 1 });
        this.props.onReady();
      },
      (err: any) => {
        console.log("ERROR:", err);
        this.setState({ cards: undefined, status: 1 });
        this.props.onReady();
      }
    );
  };

  handleListChange = async (changeBy: number) => {
    const index = this.state.lists.indexOf(this.state.selectedList);
    let maxIndex = this.state.lists.length - 1;
    let newIndex = index + changeBy;
    if (newIndex <= -1) newIndex = maxIndex;
    if (newIndex > maxIndex) newIndex = 0;

    await this.setState({
      selectedList: this.state.lists[newIndex],
      status: 0
    });
    this.loadCards(this.state.trello);
    this.saveHistory();
  };

  handleListSelect = async (id: string) => {
    await this.setState({
      selectedList: this.state.lists.find(list => list.id === id),
      status: -1
    });
    this.loadCards(this.state.trello);
    this.saveHistory();
  };

  handleBoardSelect = async (id: string) => {
    await this.setState({
      selectedBoard: this.state.boards.find(board => board.id === id),
      selectedList: {} as any,
      status: -1
    });
    this.loadBoards(this.state.trello);
    this.saveHistory();
  };

  getNavigator = () => {
    return (
      <>
        <div className="trello-board-navigator trello-navigator">
          <div className="dropdown">
            <button
              className="trello-dropdown-button"
              type="button"
              id="trello-boards-dropdown"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              <h6 className="text-center">{this.state.selectedBoard.name}</h6>
            </button>
            <div
              className="dropdown-menu"
              aria-labelledby="trello-boards-dropdown"
            >
              {this.state.boards.map(board => {
                return (
                  <div
                    onClick={() => this.handleBoardSelect(board.id)}
                    key={board.id}
                    className="dropdown-item"
                  >
                    {board.name}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className="trello-list-navigator trello-navigator">
          <div onClick={() => this.handleListChange(-1)} className="icon">
            <FontAwesomeIcon icon={faAngleLeft} />
          </div>
          <div className="dropdown">
            <button
              className="trello-dropdown-button"
              type="button"
              id="trello-lists-dropdown"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              <h3 className="text-center">{this.state.selectedList.name}</h3>
            </button>
            <div
              className="dropdown-menu"
              aria-labelledby="trello-lists-dropdown"
            >
              {this.state.lists.map(list => {
                return (
                  <div
                    onClick={() => this.handleListSelect(list.id)}
                    key={list.id}
                    className="dropdown-item"
                  >
                    {list.name}
                  </div>
                );
              })}
            </div>
          </div>

          <div onClick={() => this.handleListChange(+1)} className="icon">
            <FontAwesomeIcon icon={faAngleRight} />
          </div>
        </div>
      </>
    );
  };

  showTrelloInfo = () => {
    if (this.props.apiKey.trim().length === 0)
      return <h4>Configure Trello to sync your cards</h4>;

    if (this.state.logged && this.state.status === 1) {
      if (this.state.cards === undefined) {
        return (
          <div className="d-flex flex-column align-items-center">
            <FadeIn className="trello-status-container">
              <FontAwesomeIcon icon={faTimes} className="trello-status error" />
              <h5 className="trello-status-text">
                Cannot get Trello.
                <br />
                Check the config
              </h5>
            </FadeIn>
          </div>
        );
      }

      if (this.state.cards.length === 0) {
        return (
          <>
            {this.getNavigator()}
            <div className="d-flex flex-column  align-items-center">
              <FadeIn className="trello-status-container">
                <Lottie
                  height="120px"
                  width="120px"
                  config={{
                    animationData: checked,
                    loop: false,
                    autoplay: true
                  }}
                />
                <h5 className="trello-status-text">It's empty!</h5>
              </FadeIn>
            </div>
          </>
        );
      }

      return (
        <>
          {this.getNavigator()}
          <div id="trello-cards-container">
            {this.state.cards.map(card => (
              <FadeIn key={card.id}>
                <TrelloCard card={card} />
              </FadeIn>
            ))}
          </div>
        </>
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
            <h5 className="trello-status-text">Fetching Trello...</h5>
          </div>
        </FadeIn>
      );
    }
  };

  handleSave = (apiKey?: any) => {
    localStorage.setItem("trello-config", JSON.stringify({ apiKey }));
  };

  handleReady = (trello: any) => {
    if (this.state.logged) return;
    this.loadBoards(trello);
    this.setState({ logged: true, trello });
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
          onSave={this.handleSave}
          onReady={this.handleReady}
        />
        {this.showTrelloInfo()}
      </div>
    );
  }
}

export default TrelloIntegration;
