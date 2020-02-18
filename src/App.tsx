import React, { Component } from "react";
import SearchBar from "./components/SearchBar";
import BookmarkBar from "./components/BookmarkBar";
import "./styles/App.scss";
import TodoBox from "./components/TodoBox";
import TrelloIntegration from "./components/TrelloIntegration";
import CalendarIntegration from "./components/CalendarIntegration";
import backgroundInfo from "./assets/background.json";

interface AppState {
  backgroundAuthor: string;
  backgroundAuthorLink: string;
}

class App extends Component<any, AppState> {
  state = { backgroundAuthor: "", backgroundAuthorLink: "" };

  componentDidMount() {
    let background: any;

    const now = new Date();
    if (now.getHours() >= 6 && now.getHours() <= 18) {
      background = backgroundInfo.day;
    } else {
      background = backgroundInfo.night;
    }

    document.getElementsByTagName("body")[0].background = background.image;

    this.setState({
      backgroundAuthor: background.author.name,
      backgroundAuthorLink: background.author.link
    });
  }

  handleTrelloSave = (apiKey?: string, listId?: string) => {
    localStorage.setItem("trello-config", JSON.stringify({ apiKey, listId }));
  };

  loadTrelloIntegration = () => {
    const configEncoded = localStorage.getItem("trello-config");
    if (configEncoded === null) {
      return (
        <TrelloIntegration
          apiKey={""}
          listId={""}
          onSettingsChange={this.handleTrelloSave}
        />
      );
    } else {
      const config = JSON.parse(configEncoded);
      return (
        <TrelloIntegration
          apiKey={config.apiKey}
          listId={config.listId}
          onSettingsChange={this.handleTrelloSave}
        />
      );
    }
  };

  render() {
    return (
      <React.Fragment>
        <div id="header-container">
          <SearchBar />
          <BookmarkBar />
        </div>
        <div id="middle-container">
          <TodoBox />
          <CalendarIntegration />
          {this.loadTrelloIntegration()}
        </div>
        <div id="footer-container">
          <div className="footer-info">
            Homepage made by{" "}
            <a
              href="https://github.com/Pauloo27/homepage"
              target="_blank"
              rel="noopener noreferrer"
            >
              Pauloo27
            </a>{" "}
            under GPL-2 license.
          </div>
          <div id="background-info" className="footer-info">
            Image by{" "}
            <a
              href={this.state.backgroundAuthorLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              {this.state.backgroundAuthor}
            </a>
            .
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default App;
