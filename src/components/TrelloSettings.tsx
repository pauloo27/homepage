import React, { Component } from "react";
import "../styles/TrelloSettings.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import TrelloClient, { Trello } from "react-trello-client";

interface TrelloSettingsProps {
  apiKey: string;
  listId: string;
  onSave: Function;
  onReady: Function;
}

interface TrelloSettingsState {
  apiKey: string;
  listId: string;
  loadedApiKey: string;
  boards: Array<any>;
  lists: Array<any>;
  selectedBoard: string;
  boardsLoaded: boolean;
  /*
  -2 = No Key
  -1 = Key ok, no Token
  0 = Nothing yet
  1 = Key and Token OK, nedding Client Start
  2 = Key, Token and Client OK
  */
  loginState: number;
}

class TrelloSettings extends Component<
  TrelloSettingsProps,
  TrelloSettingsState
> {
  state = {
    apiKey: "",
    listId: "",
    loadedApiKey: "",
    loginState: 0,
    boards: new Array<any>(),
    lists: new Array<any>(),
    selectedBoard: "",
    boardsLoaded: false
  };

  handleSave = () => {
    let loginState = 0;

    if (this.state.apiKey.trim().length === 0) {
      loginState = -2;
    } else {
      if (localStorage.getItem("trello_token") === null) {
        loginState = -1;
      } else {
        loginState = 1;
      }
    }

    this.setState({ loadedApiKey: this.state.apiKey, loginState });
    this.props.onSave(this.state.apiKey, this.state.listId);
  };

  handleKeyChange = (e: React.ChangeEvent<HTMLElement>) => {
    this.setState({ apiKey: (e.target as any).value });
  };

  componentDidMount = async () => {
    let loginState = 0;

    if (this.props.apiKey.trim().length === 0) {
      loginState = -2;
    } else {
      if (localStorage.getItem("trello_token") === null) {
        loginState = -1;
      } else {
        loginState = 1;
      }
    }

    await this.setState({
      loginState,
      apiKey: this.props.apiKey,
      listId: this.props.listId,
      loadedApiKey: this.props.apiKey
    });
  };

  handleLogin = () => {
    if (!this.state.boardsLoaded) {
      this.loadBoards();
    }
    this.props.onReady(Trello);
  };

  loadBoards = async () => {
    Trello.get(
      "members/me/boards",
      (res: any) => {
        console.log("get boards");
        this.setState({ boardsLoaded: true, boards: res });
      },
      (err: any) => {
        console.log(err);
      }
    );
  };

  loadLists = async () => {
    Trello.get(
      `boards/${this.state.selectedBoard}/lists`,
      (res: any) => {
        console.log("get lists");
        this.setState({ lists: res });
      },
      (err: any) => {
        console.log(err);
      }
    );
  };

  handleBoardChange = async (e: React.ChangeEvent<any>) => {
    await this.setState({ selectedBoard: e.target.value });
    this.loadLists();
  };

  handleListChange = async (e: React.ChangeEvent<any>) => {
    this.setState({ listId: e.target.value });
  };

  getTrelloClient = () => {
    if (this.state.loginState === -2 || this.state.loginState === 0)
      return null;
    return (
      <TrelloClient
        apiKey={this.state.loadedApiKey} // Get the API key from https://trello.com/app-key/
        clientVersion={1} // number: {1}, {2}, {3}
        apiEndpoint="https://api.trello.com" // string: "https://api.trello.com"
        authEndpoint="https://trello.com" // string: "https://trello.com"
        intentEndpoint="https://trello.com" // string: "https://trello.com"
        authorizeName="Homepage" // string: "React Trello Client"
        authorizeType="popup" // string: popup | redirect
        authorizePersist={true}
        authorizeInteractive={true}
        authorizeScopeRead={true} // boolean: {true} | {false}
        authorizeScopeWrite={true} // boolean: {true} | {false}
        authorizeScopeAccount={true} // boolean: {true} | {false}
        authorizeExpiration="never" // string: "1hour", "1day", "30days" | "never"
        authorizeOnSuccess={this.handleLogin} // function: {() => console.log('Login successful!')}
        authorizeOnError={() => console.log("Login error!")} // function: {() => console.log('Login error!')}
        autoAuthorize={true} // boolean: {true} | {false}
        authorizeButton={true} // boolean: {true} | {false}
        buttonStyle="metamorph" // string: "metamorph" | "flat"
        buttonColor="green" // string: "green" | "grayish-blue" | "light"
        buttonText="Login with Trello" // string: "Login with Trello"
      />
    );
  };

  render() {
    return (
      <div
        className="modal fade"
        id="trello-settings-modal"
        tabIndex={-1}
        role="dialog"
        aria-labelledby="trello-setings-modal-label"
        aria-hidden="true"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="trello-settings-modal-label">
                Trello settings
              </h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">
                  <FontAwesomeIcon icon={faTimes} />
                </span>
              </button>
            </div>
            <div className="modal-body">
              <label>
                Login into your Trello Account and get an API key in{" "}
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://trello.com/app-key"
                >
                  https://trello.com/app-key
                </a>.{" "}
                Then add the homepage URL to the Allowed Origins.
              </label>
              <input
                defaultValue={this.state.apiKey}
                onChange={this.handleKeyChange}
                placeholder="API key (insert a value and save before login)"
              />
              <div
                id="trello-login-container"
                className={this.state.loginState !== -1 ? "hidden" : ""}
              >
                {this.getTrelloClient()}
              </div>
              <div
                id="board-selector-holder"
                className={
                  this.state.loginState === 1 || this.state.loginState === -1
                    ? ""
                    : "hidden"
                }
              >
                <label>Board:</label>
                <select
                  id="title"
                  name="title"
                  defaultValue=""
                  onChange={this.handleBoardChange}
                >
                  <option value="">--</option>
                  {this.state.boards.map((board: any) => (
                    <option key={board.id} value={board.id}>
                      {board.name}
                    </option>
                  ))}
                </select>
              </div>
              <div
                id="list-selector-holder"
                className={this.state.selectedBoard !== "" ? "" : "hidden"}
              >
                <label>List:</label>
                <select
                  id="title"
                  name="title"
                  defaultValue=""
                  onChange={this.handleListChange}
                >
                  <option value="">--</option>
                  {this.state.lists.map((list: any) => (
                    <option key={list.id} value={list.id}>
                      {list.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-dismiss="modal"
                onClick={() => window.location.reload()}
              >
                Close
              </button>
              <button
                onClick={this.handleSave}
                type="button"
                className="btn btn-primary"
              >
                Save changes
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default TrelloSettings;
