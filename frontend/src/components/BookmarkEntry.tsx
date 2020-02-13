import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import BookmarkEditor from "./BookmarkEditor";

interface BookmarkEntryProps {
  id: string;
  onUpdate: Function;
  url: string;
  icon: string;
  name: string;
}

class BookmarkEntry extends Component<BookmarkEntryProps> {
  handleEdit = () => {};

  handleSave = (entry: any) => {
    entry.id = this.props.id;
    this.props.onUpdate(entry);
  };

  render() {
    let icon = this.props.icon;

    if (icon === "") {
      icon = `https://external-content.duckduckgo.com/ip3/${
        this.props.url.split("://")[1].split("/")[0]
      }.ico`;
    }

    return (
      <div className="bookmark-entry">
        <a href={this.props.url} target="_blank" rel="noopener noreferrer">
          <img src={icon} alt={`${this.props.name} icon`} />
        </a>
        <div
          className="bookmark-edit"
          data-toggle="modal"
          data-target={`#bookmark-edit-modal-${this.props.id}`}
        >
          <FontAwesomeIcon icon={faPen} />
        </div>
        <BookmarkEditor
          id={`bookmark-edit-modal-${this.props.id}`}
          name={this.props.name}
          url={this.props.url}
          icon={this.props.icon}
          onSave={this.handleSave}
        />
      </div>
    );
  }
}

export default BookmarkEntry;
