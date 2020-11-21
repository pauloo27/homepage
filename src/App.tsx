import React, { Component } from "react";
import $ from "jquery";
import { faInfo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SearchBar from "./components/SearchBar";
import BookmarkBar from "./components/BookmarkBar";
import ToDoBox from "./components/ToDoBox";
import TrelloIntegration from "./components/TrelloIntegration";
import GCalendarIntegration from "./components/GCalendarIntegration";
import GeneralSettings from "./components/GeneralSettings";
import BackgroundSettings from "./components/BackgroundSettings";
import ProjectInfo from "./components/ProjectInfo";
import BackgroundInfo from "./components/BackgroundInfo";
import WelcomeModal from "./components/WelcomeModal";
import UpdateModal from "./components/UpdateModal";
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
  showToDo: boolean;
  showCalendar: boolean;
  showTrello: boolean;
  expandBookmarks: boolean;
  firstStartup: boolean;
  currentVersion: string;
  lastVersion: string;
}

class App extends Component<any, AppState> {
  state = {
    dayBackground: { url: "", author: "", authorUrl: "" },
    nightBackground: { url: "", author: "", authorUrl: "" },
    currentBackground: { url: "", author: "", authorUrl: "" },
    backgroundToggled: false,
    engineType: "",
    engineUrl: undefined,
    showToDo: false,
    showTrello: false,
    showCalendar: false,
    expandBookmarks: false,
    firstStartup: false,
    currentVersion: "",
    lastVersion: "",
  };

  timerId: any;

  loadBackgrounds = async () => {
    const backgrounds = localStorage.getItem("backgrounds");
    if (backgrounds === null) {
      this.setState({
        dayBackground: {
          url: "https://i.imgur.com/CdaQWae.jpg",
          author: "sebastianinman",
          authorUrl: "https://dynamicwallpaper.club/wallpaper/ci7xe3twgfv",
        },
        nightBackground: {
          url: "https://i.imgur.com/eSK3Xdd.jpg",
          author: "sebastianinman",
          authorUrl: "https://dynamicwallpaper.club/wallpaper/ci7xe3twgfv",
        },
      }, () => this.saveBackgrounds());
    } else {
      this.setState(JSON.parse(backgrounds));
    }
  }

  checkVersion() {
    const packageInfo = require("../package.json");
    let version = localStorage.getItem("version");

    if (version === null) this.setState({firstStartup: true});

    localStorage.setItem("version", packageInfo.version);
    if (version === null) version = packageInfo.version;
    this.setState({currentVersion: packageInfo.version, lastVersion: version!});
  }

  async componentDidMount() {
    await this.loadBackgrounds();

    this.checkBackground();

    this.checkVersion();

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

  
  updateBackground = () => {
    const now = new Date();
    let newBackground: Background;

    if (now.getHours() >= 6 && now.getHours() < 18) {
      newBackground = this.state.dayBackground;
    } else {
      newBackground = this.state.nightBackground;
    }
    this.setBackground(newBackground);
  }


  checkBackground = () => {
    if (this.state.backgroundToggled) return;
    
    this.updateBackground();
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
    ($('[data-toggle="tooltip"]') as any).tooltip();
  };

  handleTrelloReady = () => {
    this.setupTooltip();
  };

  handleGeneralSave = (config: any) => {
    this.setState(config);
  };

  handleBackgroundSave = async (
    dayBackground: Background,
    nightBackground: Background
  ) => {
    this.setState({ dayBackground, nightBackground, backgroundToggled: false }, () => {
      this.saveBackgrounds();
      this.checkBackground();
    });
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

  handleBackgroundChange = () => {
    this.loadBackgrounds().then(this.updateBackground);
  };

  render() {
    if (this.state.currentBackground.url === "") return null;

    let cardsCount = [this.state.showToDo, this.state.showCalendar, this.state.showTrello]
      .filter(b => b).length;

    const bookmarksExpanded = cardsCount !== 3 && this.state.expandBookmarks;

    if (bookmarksExpanded) {
      cardsCount++;
    }

    this.setupTooltip();

    return (
      <>
        <link rel="preload" href={this.state.dayBackground.url} as="image" />
        <link rel="preload" href={this.state.nightBackground.url} as="image" />
        {this.state.firstStartup ? <WelcomeModal updateBackgrounds={this.handleBackgroundChange} /> : null}
        {this.state.currentVersion !== this.state.lastVersion ? 
          <UpdateModal currentVersion={this.state.currentVersion} lastVersion={this.state.lastVersion} /> 
        : null}
        <div id="header-container">
          <SearchBar
            engineType={this.state.engineType}
            engineUrl={this.state.engineUrl}
            expand={bookmarksExpanded}
          />
          {bookmarksExpanded ? null : <BookmarkBar setupTooltip={this.setupTooltip} expand={false} /> }
        </div>
        <div id="middle-container" className={`card-count-${cardsCount}`}>
          {this.state.showToDo ? <ToDoBox setupTooltip={this.setupTooltip} /> : null}
          {this.state.showCalendar ? <GCalendarIntegration /> : null}
          {this.state.showTrello ? this.loadTrelloIntegration() : null}
          {bookmarksExpanded ? <BookmarkBar setupTooltip={this.setupTooltip} expand /> : null}
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
        <GeneralSettings onSave={this.handleGeneralSave} />
        <BackgroundSettings
          updateBackgrounds={this.handleBackgroundChange}
          day={this.state.dayBackground}
          night={this.state.nightBackground}
          onSave={this.handleBackgroundSave}
        />
      </>
    );
  }
}

export default App;
