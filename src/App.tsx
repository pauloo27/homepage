import React, { Component } from "react";
import SearchBar from "./components/SearchBar";
import BookmarkBar from "./components/BookmarkBar";
import "./styles/App.scss";
import TodoBox from "./components/TodoBox";
import TrelloIntegration from "./components/TrelloIntegration";
import CalendarIntegration from "./components/CalendarIntegration";
import backgroundInfo from "./assets/background.json";
import SearchEngineSettings from "./components/SearchEngineSettings";
import BackgroundSettings from "./components/BackgroundSettings";
import ProjectInfo from "./components/ProjectInfo";
import BackgroundInfo from "./components/BackgroundInfo";

interface AppState {
  backgroundAuthor: string;
  backgroundAuthorLink: string;
  engineType: string;
  engineUrl?: string;
}

class App extends Component<any, AppState> {
  state = {
    backgroundAuthor: "",
    backgroundAuthorLink: "",
    engineType: "",
    engineUrl: undefined
  };

  componentDidMount() {
    let background: any;

    const now = new Date();
    if (now.getHours() >= 6 && now.getHours() < 18) {
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

  handleSearchEngineSave = (config: any) => {
    this.setState(config);
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
          <SearchBar
            engineType={this.state.engineType}
            engineUrl={this.state.engineUrl}
          />
          <BookmarkBar />
        </div>
        <div id="middle-container">
          <TodoBox />
          <CalendarIntegration />
          {this.loadTrelloIntegration()}
        </div>
        <div id="footer-container">
          <ProjectInfo />
          <BackgroundInfo
            backgroundAuthor={this.state.backgroundAuthor}
            backgroundAuthorLink={this.state.backgroundAuthorLink}
          />
        </div>
        <BackgroundSettings />
        <SearchEngineSettings onSave={this.handleSearchEngineSave} />
      </React.Fragment>
    );
  }
}

export default App;
