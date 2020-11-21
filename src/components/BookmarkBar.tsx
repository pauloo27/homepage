import React, { Component } from "react";
import "../styles/BookmarkBar.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faPen, faCheck } from "@fortawesome/free-solid-svg-icons";
import BookmarkEntry from "./BookmarkEntry";
import BookmarkEditor from "./BookmarkEditor";
import { getProvider } from "../utils/ProviderManager";

interface BookmarkBarProps {
  expand: boolean;
  setupTooltip: Function;
}

interface BookmarkBarState {
  editable: boolean;
  entries: Array<any>;
}

class BookmarkBar extends Component<BookmarkBarProps, BookmarkBarState> {
  state = { editable: false, entries: new Array<any>() };

  componentDidMount() {
    const bookmarks = getProvider().getValue("bookmarks");
    if (bookmarks !== null) {
      const entries = JSON.parse(bookmarks);
      this.setState({ entries });
    } else {
      this.saveBookmarks();
    }
  }

  saveBookmarks = () => {
    getProvider().setValue("bookmarks", JSON.stringify(this.state.entries));
  };

  handleEditToggle = () => {
    this.setState(prevState => ({ editable: !prevState.editable }));
  };

  handleBookmarkDelete = async (bookmark: any) => {
    let { entries } = this.state;
    entries = entries.filter((entry) => entry.id !== bookmark.id);
    this.setState({ entries }, this.saveBookmarks);
  };

  handleBookmarkUpdate = async (bookmark: any) => {
    let { entries } = this.state;
    entries = entries.filter((entry) => entry.id !== bookmark.id);
    entries.push(bookmark);
    this.setState({ entries }, this.saveBookmarks);
  };

  handleNewBookmark = (entry: any) => {
    let id = "";
    do {
      id =
        Math.random().toString(36).substring(2, 12) +
        Math.random().toString(36).substring(2, 12) +
        Math.random().toString(36).substring(2, 12) +
        Math.random().toString(36).substring(2, 12);
    } while (
      // eslint-disable-next-line
      this.state.entries.filter((entry) => entry.id === id).length !== 0
    );
    entry.id = id;

    const { entries } = this.state;
    entries.push(entry);
    this.setState({ entries }, () => {
      this.saveBookmarks();
      this.props.setupTooltip();
    });
  };

  getEntries = () => {
    const { entries } = this.state;

    return entries.map((bookmark) => (
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
  };

  render() {
    return (
      <div id="bookmark-bar" className={`homepage-card ${this.props.expand ? "expand" : ""}`}>
        <div className="homepage-card-header">
          <div
            id="bookmark-edit-toggle"
            className="homepage-card-settings-holder"
            onClick={this.handleEditToggle}
            data-toggle="tooltip"
            title="Toggle bookmark edit mode"
          >
            <FontAwesomeIcon
              icon={this.state.editable ? faCheck : faPen}
              className="homepage-card-settings"
            />
          </div>
          {this.props.expand ? <h4>Bookmarks:</h4> : null}
          <div
            data-toggle="tooltip"
            title="Add new bookmark"
            className="homepage-card-settings-holder"
          >
            <div
              className="homepage-card-settings-holder"
              data-toggle="modal"
              data-target="#bookmark-add-modal"
            >
              <FontAwesomeIcon
                icon={faPlus}
                className="homepage-card-settings"
              />
            </div>
          </div>
        </div>
        <div
          className={`bookmark-list ${this.state.editable ? "editable" : ""}`}
        >
          {this.getEntries()}
        </div>
        <BookmarkEditor
          id="bookmark-add-modal"
          name=""
          url=""
          icon=""
          onSave={this.handleNewBookmark}
          // eslint-disable-next-line
          onClose={() => {}}
        />
      </div>
    );
  }
}

export default BookmarkBar;
