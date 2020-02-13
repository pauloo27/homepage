import React, { Component } from "react";
import "../styles/BookmarkBar.scss";
import BookmarkEntry from "./BookmarkEntry";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faPen, faCheck } from "@fortawesome/free-solid-svg-icons";
import BookmarkEditor from "./BookmarkEditor";

interface BookmarkBarState {
  editable: boolean;
  entries: Array<any>;
}

class BookmarkBar extends Component<any, BookmarkBarState> {
  state = { editable: false, entries: new Array<any>() };

  saveBookmarks = () => {
    localStorage.setItem("bookmarks", JSON.stringify(this.state.entries));
  };

  componentDidMount() {
    const bookmarks = localStorage.getItem("bookmarks");
    if (bookmarks !== null) {
      const entries = JSON.parse(bookmarks);
      this.setState({ entries });
    } else {
      this.saveBookmarks();
    }
  }

  handleEditToggle = () => {
    this.setState({ editable: !this.state.editable });
  };

  handleBookmarkDelete = async (bookmark: any) => {
    let entries = this.state.entries;
    entries = entries.filter(entry => entry.id !== bookmark.id);
    await this.setState({ entries });
    this.saveBookmarks();
  };

  handleBookmarkUpdate = async (bookmark: any) => {
    let entries = this.state.entries;
    entries = entries.filter(entry => entry.id !== bookmark.id);
    entries.push(bookmark);
    await this.setState({ entries });
    this.saveBookmarks();
  };

  handleNewBookmark = (entry: any) => {
    let id = "";
    do {
      id =
        Math.random()
          .toString(36)
          .substring(2, 12) +
        Math.random()
          .toString(36)
          .substring(2, 12) +
        Math.random()
          .toString(36)
          .substring(2, 12) +
        Math.random()
          .toString(36)
          .substring(2, 12);
    } while (
      // eslint-disable-next-line
      this.state.entries.filter(entry => entry.id === id).length !== 0
    );
    entry.id = id;

    const entries = this.state.entries;
    entries.push(entry);
    this.setState({ entries });
    this.saveBookmarks();
    window.location.reload();
  };

  getEntries = () => {
    let entries = this.state.entries;

    if (entries.length > 14) {
      entries = entries.slice(0, 15);
    }

    const bookmarks = entries.map(bookmark => (
      <BookmarkEntry
        key={bookmark.id}
        id={bookmark.id}
        name={bookmark.name}
        url={bookmark.url}
        icon={bookmark.icon}
        onUpdate={this.handleBookmarkUpdate}
        onDelete={this.handleBookmarkDelete}
      />
    ));
    if (entries.length > 14) {
      return (
        <React.Fragment>
          {bookmarks}
          <h4>...</h4>
        </React.Fragment>
      );
    } else {
      return bookmarks;
    }
  };

  render() {
    return (
      <div id="bookmark-bar" className="homepage-card">
        <div
          className={`bookmark-list ${this.state.editable ? "editable" : ""}`}
        >
          {this.getEntries()}
        </div>
        <div className="homepage-card-header">
          <div
            id="bookmark-edit-toggle"
            className="homepage-card-settings-holder"
            onClick={this.handleEditToggle}
          >
            <FontAwesomeIcon
              icon={this.state.editable ? faCheck : faPen}
              className="homepage-card-settings"
            />
          </div>
          <div
            className="homepage-card-settings-holder"
            data-toggle="modal"
            data-target="#bookmark-add-modal"
          >
            <FontAwesomeIcon icon={faPlus} className="homepage-card-settings" />
          </div>
        </div>
        <BookmarkEditor
          id="bookmark-add-modal"
          name=""
          url=""
          icon=""
          closeButtonText="Close"
          onSave={this.handleNewBookmark}
          onClose={() => {}}
        />
      </div>
    );
  }
}

export default BookmarkBar;
