import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

interface BackgroundSettingsProps {
  onSave: Function;
  day: any;
  night: any;
}

class BackgroundSettings extends Component<BackgroundSettingsProps> {
  state = {
    "day-url": "",
    "day-author": "",
    "day-authorUrl": "",
    "night-url": "",
    "night-author": "",
    "night-authorUrl": ""
  };

  handleChange = (e: React.ChangeEvent<HTMLElement>) => {
    const name = (e.target as any).name;
    const value = (e.target as any).value;

    this.setState({ [name]: value });
  };

  handleSave = () => {
    this.props.onSave(
      {
        url: this.state["day-url"],
        author: this.state["day-author"],
        authorUrl: this.state["day-authorUrl"]
      },
      {
        url: this.state["night-url"],
        author: this.state["night-author"],
        authorUrl: this.state["night-authorUrl"]
      }
    );
  };

  componentDidMount() {
    this.setState({
      "day-url": this.props.day.url,
      "day-author": this.props.day.author,
      "day-authorUrl": this.props.day.authorUrl,
      "night-url": this.props.night.url,
      "night-author": this.props.night.author,
      "night-authorUrl": this.props.night.authorUrl
    });
  }

  render() {
    return (
      <div
        className="modal fade"
        id="background-settings-modal"
        tabIndex={-1}
        role="dialog"
        aria-labelledby="background-settings-modal-label"
        aria-hidden="true"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="background-settings-modal-label">
                Background settings
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
              <label>Day background</label>
              <input
                name="day-url"
                placeholder="Image URL"
                onChange={this.handleChange}
                defaultValue={this.state["day-url"]}
              />
              <input
                name="day-author"
                placeholder="Author name"
                onChange={this.handleChange}
                defaultValue={this.state["day-author"]}
              />
              <input
                name="day-authorUrl"
                placeholder="Author page URL"
                onChange={this.handleChange}
                defaultValue={this.state["day-authorUrl"]}
              />
              <label>Night background</label>
              <input
                name="night-url"
                placeholder="Image URL"
                onChange={this.handleChange}
                defaultValue={this.state["night-url"]}
              />
              <input
                name="night-author"
                placeholder="Author name"
                onChange={this.handleChange}
                defaultValue={this.state["night-author"]}
              />
              <input
                name="night-authorUrl"
                placeholder="Author page URL"
                onChange={this.handleChange}
                defaultValue={this.state["night-authorUrl"]}
              />
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-dismiss="modal"
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={this.handleSave}
              >
                Save changes
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default BackgroundSettings;
