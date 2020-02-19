import React, { Component } from "react";
import SearchBar from "./components/SearchBar";
import BookmarkBar from "./components/BookmarkBar";
import "./styles/App.scss";
import TodoBox from "./components/TodoBox";
import TrelloIntegration from "./components/TrelloIntegration";
import CalendarIntegration from "./components/CalendarIntegration";
import SearchEngineSettings from "./components/SearchEngineSettings";
import BackgroundSettings from "./components/BackgroundSettings";
import ProjectInfo from "./components/ProjectInfo";
import BackgroundInfo from "./components/BackgroundInfo";

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

  setBackground = () => {
    const now = new Date();
    let currentBackground: Background;
    if (now.getHours() >= 6 && now.getHours() < 18) {
      currentBackground = this.state.dayBackground;
    } else {
      currentBackground = this.state.nightBackground;
    }

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
          url: "https://images.unsplash.com/photo-1518012961-5efdfd47ba75",
          author: "Alex Knight",
          authorUrl: "https://unsplash.com/@agkdesign"
        },
        nightBackground: {
          url: "https://images.unsplash.com/Ys-DBJeX0nE.JPG",
          author: "Alex Knight",
          authorUrl: "https://unsplash.com/@agkdesign"
        }
      });

      this.saveBackgrounds();
    } else {
      await this.setState(JSON.parse(value));
    }

    this.setBackground();
  }

  handleTrelloSave = (apiKey?: string, listId?: string) => {
    localStorage.setItem("trello-config", JSON.stringify({ apiKey, listId }));
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
    if (this.state.currentBackground.url === "") return null;
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
      </React.Fragment>
    );
  }
}

export default App;
