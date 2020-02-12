import React, { Component } from "react";
import "../styles/SearchBar.scss";

class SearchBar extends Component {
  render() {
    return (
      <form
        action="https://duckduckgo.com/"
        id="search-bar-container"
        className="homepage-card"
      >
        <input name="q" placeholder="Search at DuckDuckGO" autoComplete="off" />
        <button type="submit">
          <img
            src="https://duckduckgo.com/assets/common/dax-logo.svg"
            alt="DuckDuckGO Logo"
          />
        </button>
      </form>
    );
  }
}

export default SearchBar;
