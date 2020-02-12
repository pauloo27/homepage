import React, { Component } from "react";
import SearchBar from "./components/SearchBar";
import BookmarkBar from "./components/BookmarkBar";
import "./styles/App.scss";
import TodoBox from "./components/TodoBox";
import TrelloIntegration from "./components/TrelloIntegration";
import CalendarIntegration from "./components/CalendarIntegration";

class App extends Component {
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
      </React.Fragment>
    );
  }
}

export default App;
