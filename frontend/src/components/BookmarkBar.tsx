import React, { Component } from "react";
import "../styles/BookmarkBar.scss";
import BookmarkEntry from "./BookmarkEntry";

class BookmarkBar extends Component {
  render() {
    return (
      <div id="bookmark-bar" className="homepage-card">
        <BookmarkEntry />
      </div>
    );
  }
}

export default BookmarkBar;
