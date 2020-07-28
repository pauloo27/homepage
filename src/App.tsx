import React, { Component } from "react";
import $ from "jquery";
import { faInfo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SearchBar from "./components/SearchBar";
import BookmarkBar from "./components/BookmarkBar";
import ToDoBox from "./components/ToDoBox";
import TrelloIntegration from "./components/TrelloIntegration";
import GCalendarIntegration from "./components/GCalendarIntegration";
import SearchEngineSettings from "./components/SearchEngineSettings";
import BackgroundSettings from "./components/BackgroundSettings";
import ProjectInfo from "./components/ProjectInfo";
import BackgroundInfo from "./components/BackgroundInfo";
import "./styles/App.scss";

interface Background {
  url: string;
  author: string;
  authorUrl: string;
}

interface AppState {
  dayBackground: Background;
  nightBackground: Background;
  currentBackground: Background;
  backgroundToggled: boolean;
  engineType: string;
  engineUrl?: string;
}

class App extends Component<any, AppState> {
  state = {
    dayBackground: { url: "", author: "", authorUrl: "" },
    nightBackground: { url: "", author: "", authorUrl: "" },
    currentBackground: { url: "", author: "", authorUrl: "" },
    backgroundToggled: false,
    engineType: "",
    engineUrl: undefined,
  };

  timerId: any;

  async componentDidMount() {
    const value = localStorage.getItem("backgrounds");
    if (value === null) {
      await this.setState({
        dayBackground: {
          url: "https://i.imgur.com/vq3OEsR.jpg",
          author: "sebastianinman",
          authorUrl: "https://dynamicwallpaper.club/wallpaper/ci7xe3twgfv",
        },
        nightBackground: {
          url: "https://i.imgur.com/eSK3Xdd.jpg",
          author: "sebastianinman",
          authorUrl: "https://dynamicwallpaper.club/wallpaper/ci7xe3twgfv",
        },
      });

      this.saveBackgrounds();
    } else {
      await this.setState(JSON.parse(value));
    }

    this.checkBackground();

    this.timerId = setInterval(() => this.checkBackground(), 10 * 1000);
  }

  componentWillUnmount() {
    clearInterval(this.timerId);
  }

  setBackground = (background: Background) => {
    if (this.state.currentBackground === background) return;

    this.setState({ currentBackground: background });
    document.getElementsByTagName("body")[0].background = background.url;
  };

  toggleBackground = () => {
    let newBackground: Background;

    if (this.state.currentBackground === this.state.dayBackground) {
      newBackground = this.state.nightBackground;
    } else {
      newBackground = this.state.dayBackground;
    }

    this.setState({ backgroundToggled: true });
    this.setBackground(newBackground);
  };

  checkBackground = () => {
    if (this.state.backgroundToggled) return;

    const now = new Date();
    let newBackground: Background;

    if (now.getHours() >= 6 && now.getHours() < 18) {
      newBackground = this.state.dayBackground;
    } else {
      newBackground = this.state.nightBackground;
    }

    this.setBackground(newBackground);
  };

  saveBackgrounds = () => {
    localStorage.setItem(
      "backgrounds",
      JSON.stringify({
        dayBackground: this.state.dayBackground,
        nightBackground: this.state.nightBackground,
      })
    );
  };

  setupTooltip = () => {
    $(() => {
      ($('[data-toggle="tooltip"]') as any).tooltip();
    });
  };

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
    this.setState({ backgroundToggled: false });
    this.checkBackground();
  };

  loadTrelloIntegration = () => {
    const configEncoded = localStorage.getItem("trello-config");
    if (configEncoded === null) {
      return <TrelloIntegration apiKey="" onReady={this.handleTrelloReady} />;
    }
    const config = JSON.parse(configEncoded);
    return (
      <TrelloIntegration
        apiKey={config.apiKey}
        onReady={this.handleTrelloReady}
      />
    );
  };

  render() {
    if (this.state.currentBackground.url === "") return null;

    this.setupTooltip();

    return (
      <>
        <link rel="preload" href={this.state.dayBackground.url} as="image" />
        <link rel="preload" href={this.state.nightBackground.url} as="image" />
        <div id="header-container">
          <SearchBar
            engineType={this.state.engineType}
            engineUrl={this.state.engineUrl}
          />
          <BookmarkBar />
        </div>
        <div id="middle-container">
          <ToDoBox setupTooltip={this.setupTooltip} />
          <GCalendarIntegration />
          {this.loadTrelloIntegration()}
        </div>
        <div id="footer-container">
          <ProjectInfo />
          <BackgroundInfo
            toggleBackground={this.toggleBackground}
            backgroundAuthor={this.state.currentBackground.author}
            backgroundAuthorUrl={this.state.currentBackground.authorUrl}
          />
        </div>
        <div id="footer-dropdown">
          <div className="dropdown">
            <button
              className="footer-dropdown-button"
              type="button"
              id="dropdownMenuButton"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              <FontAwesomeIcon icon={faInfo} />
            </button>
            <div
              className="dropdown-menu dropdown-menu-right"
              aria-labelledby="dropdownMenuButton"
            >
              <div className="dropdown-item footer-dropdown-item">
                <ProjectInfo />
              </div>
              <div className="dropdown-item footer-dropdown-item">
                <BackgroundInfo
                  toggleBackground={this.toggleBackground}
                  backgroundAuthor={this.state.currentBackground.author}
                  backgroundAuthorUrl={this.state.currentBackground.authorUrl}
                />
                {" "}
              </div>
            </div>
          </div>
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
