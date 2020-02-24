import React, { Component } from "react";
import SearchBar from "./components/SearchBar";
import BookmarkBar from "./components/BookmarkBar";
import "./styles/App.scss";
import TodoBox from "./components/TodoBox";
import TrelloIntegration from "./components/TrelloIntegration";
import GCalendarIntegration from "./components/GCalendarIntegration";
import SearchEngineSettings from "./components/SearchEngineSettings";
import BackgroundSettings from "./components/BackgroundSettings";
import ProjectInfo from "./components/ProjectInfo";
import BackgroundInfo from "./components/BackgroundInfo";
import $ from "jquery";

interface Background {
  url: string;
  author: string;
  authorUrl: string;
}

interface AppState {
  dayBackground: Background;
  nightBackground: Background;
  currentBackground: Background;
  engineType: string;
  engineUrl?: string;
}

class App extends Component<any, AppState> {
  state = {
    dayBackground: { url: "", author: "", authorUrl: "" },
    nightBackground: { url: "", author: "", authorUrl: "" },
    currentBackground: { url: "", author: "", authorUrl: "" },
    engineType: "",
    engineUrl: undefined
  };

  timerId: any;

  setupTooltip = () => {
    $(function() {
      ($('[data-toggle="tooltip"]') as any).tooltip();
    });
  };

  setBackground = () => {
    const now = new Date();
    let currentBackground: Background;

    if (now.getHours() >= 6 && now.getHours() < 18) {
      currentBackground = this.state.dayBackground;
    } else {
      currentBackground = this.state.nightBackground;
    }

    if (this.state.currentBackground === currentBackground) return;

    this.setState({ currentBackground });
    document.getElementsByTagName("body")[0].background = currentBackground.url;
  };

  saveBackgrounds = () => {
    localStorage.setItem(
      "backgrounds",
      JSON.stringify({
        dayBackground: this.state.dayBackground,
        nightBackground: this.state.nightBackground
      })
    );
  };

  async componentDidMount() {
    const value = localStorage.getItem("backgrounds");
    if (value === null) {
      await this.setState({
        dayBackground: {
          url: "https://i.imgur.com/2yZEWjj.jpg",
          author: "Alex Knight",
          authorUrl: "https://unsplash.com/@agkdesign"
        },
        nightBackground: {
          url: "https://i.imgur.com/ilSeY3w.jpg",
          author: "Alex Knight",
          authorUrl: "https://unsplash.com/@agkdesign"
        }
      });

      this.saveBackgrounds();
    } else {
      await this.setState(JSON.parse(value));
    }

    this.setBackground();

    this.timerId = setInterval(() => this.setBackground(), 10 * 1000);
  }

  componentWillUnmount() {
    clearInterval(this.timerId);
  }

  handleTrelloReady = () => {
    this.setupTooltip();
  };

  handleSearchEngineSave = (config: any) => {
    this.setState(config);
  };

  handleBackgroundSave = async (
    dayBackground: Background,
    nightBackground: Background
  ) => {
    await this.setState({ dayBackground, nightBackground });
    await this.saveBackgrounds();
    this.setBackground();
  };

  loadTrelloIntegration = () => {
    const configEncoded = localStorage.getItem("trello-config");
    if (configEncoded === null) {
      return (
        <TrelloIntegration
          apiKey={""}
          listId={""}
          onReady={this.handleTrelloReady}
        />
      );
    } else {
      const config = JSON.parse(configEncoded);
      return (
        <TrelloIntegration
          apiKey={config.apiKey}
          listId={config.listId}
          onReady={this.handleTrelloReady}
        />
      );
    }
  };

  render() {
    if (this.state.currentBackground.url === "") return null;

    this.setupTooltip();

    return (
      <>
        <div id="header-container">
          <SearchBar
            engineType={this.state.engineType}
            engineUrl={this.state.engineUrl}
          />
          <BookmarkBar />
        </div>
        <div id="middle-container">
          <TodoBox setupTooltip={this.setupTooltip} />
          <GCalendarIntegration />
          {this.loadTrelloIntegration()}
        </div>
        <div id="footer-container">
          <ProjectInfo />
          <BackgroundInfo
            backgroundAuthor={this.state.currentBackground.author}
            backgroundAuthorUrl={this.state.currentBackground.authorUrl}
          />
        </div>
        <SearchEngineSettings onSave={this.handleSearchEngineSave} />
        <BackgroundSettings
          day={this.state.dayBackground}
          night={this.state.nightBackground}
          onSave={this.handleBackgroundSave}
        />
      </>
    );
  }
}

export default App;
