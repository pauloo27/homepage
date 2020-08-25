import React, { Component } from "react";
import "../styles/SearchBar.scss";

interface SearchBarProps {
  engineType: string;
  engineUrl?: string;
  expand: boolean;
}

class SearchBar extends Component<SearchBarProps> {
  render() {
    if (this.props.engineType.length === 0) return null;

    let name = "";
    let action = "";

    if (this.props.engineType === "duckduckgo") {
      name = "DuckDuckGO";
      action = "https://duckduckgo.com";
    }

    if (this.props.engineType === "google") {
      name = "Google";
      action = "https://google.com/search";
    }

    if (this.props.engineType === "custom") {
      name = this.props.engineUrl!.split("//")[1].split("/")[0];
      action = this.props.engineUrl!;
    }

    const icon = `https://external-content.duckduckgo.com/ip3/${
      action.split("://")[1].split("/")[0]
    }.ico`;

    return (
      <form action={action} id="search-bar-container" className={`homepage-card ${this.props.expand ? "expanded" : ""}`}>
        <input
          autoFocus
          className="text-input"
          name="q"
          placeholder={`Search at ${name}`}
          autoComplete="off"
        />
        <button type="submit">
          <img src={icon} className="icon" alt={`${name} icon`} />
        </button>
      </form>
    );
  }
}

export default SearchBar;
