import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

interface BookmarkEditorProps {
  id: string;
  onSave: Function;
  name: string;
  url: string;
  icon: string;
  onClose: Function;
}

interface BookmarkEditorState {
  name: string;
  url: string;
  icon: string;
}

class BookmarkEditor extends Component<
  BookmarkEditorProps,
  BookmarkEditorState
> {
  componentDidMount() {
    this.setState({
      name: this.props.name,
      url: this.props.url,
      icon: this.props.icon,
    });
  }

  handleNameChange = (e: React.ChangeEvent<HTMLElement>) => {
    this.setState({ name: (e.target as any).value });
  };

  handleURLChange = (e: React.ChangeEvent<HTMLElement>) => {
    this.setState({ url: (e.target as any).value });
  };

  handleIconChange = (e: React.ChangeEvent<HTMLElement>) => {
    this.setState({ icon: (e.target as any).value });
  };

  handleDelete = () => {
    this.props.onClose({ name: this.state.name, icon: this.state.icon });
  };

  handleSave = () => {
    if (
      this.state.name.trim().length === 0 ||
      this.state.url.trim().length === 0
    ) {
      return;
    }

    let { url } = this.state;
    if (!url.startsWith("http")) {
      url = `https://${url}`;
    }

    this.props.onSave({ url, name: this.state.name, icon: this.state.icon });
  };

  render() {
    return (
      <div
        className="modal fade"
        id={this.props.id}
        tabIndex={-1}
        role="dialog"
        aria-labelledby="bookmark-editor-modal-label"
        aria-hidden="true"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="bookmark-editor-modal-label">
                Bookmark editor
              </h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">
                  <FontAwesomeIcon icon={faTimes} />
                </span>
              </button>
            </div>
            <div className="modal-body">
              <div className="bookmark-settings-entry">
                <input
                  type="text"
                  placeholder="Bookmark name"
                  className="bookmark-entry-name"
                  onChange={this.handleNameChange}
                  defaultValue={this.props.name}
                />
                <input
                  type="text"
                  placeholder="Bookmark URL"
                  className="bookmark-entry-url"
                  onChange={this.handleURLChange}
                  defaultValue={this.props.url}
                />
                <input
                  type="text"
                  placeholder="Bookmark icon (leave empty to use the site favicon)"
                  className="bookmark-entry-icon"
                  onChange={this.handleIconChange}
                  defaultValue={this.props.icon}
                />
              </div>
            </div>
            <div className="modal-footer">
              {this.props.url === "" ? null :
              <button
                type="button"
                className="btn btn-secondary"
                data-dismiss="modal"
                onClick={this.handleDelete}
              >
                Delete
              </button>
              }
              <button
                type="button"
                className="btn btn-primary"
                onClick={this.handleSave}
              >
                {this.props.url === "" ? "Create" : "Save"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default BookmarkEditor;
