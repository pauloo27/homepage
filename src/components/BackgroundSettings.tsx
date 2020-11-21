import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import ThemeSelector from './ThemeSelector';

interface BackgroundSettingsProps {
  onSave: Function;
  updateBackgrounds: Function;
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
    "night-authorUrl": "",
  };

  componentDidMount() {
    this.setState({
      "day-url": this.props.day.url,
      "day-author": this.props.day.author,
      "day-authorUrl": this.props.day.authorUrl,
      "night-url": this.props.night.url,
      "night-author": this.props.night.author,
      "night-authorUrl": this.props.night.authorUrl,
    });
  }

  handleChange = (e: React.ChangeEvent<HTMLElement>) => {
    const { name } = e.target as any;
    const { value } = e.target as any;

    this.setState({ [name]: value });
  };

  handleSave = () => {
    this.props.onSave(
      {
        url: this.state["day-url"],
        author: this.state["day-author"],
        authorUrl: this.state["day-authorUrl"],
      },
      {
        url: this.state["night-url"],
        author: this.state["night-author"],
        authorUrl: this.state["night-authorUrl"],
      }
    );
  };

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
              <div id="theme-accordion" className="accordion">
                <button
                  type="button"
                  id="theme-select-heading"
                  className="btn btn-info m-1"
                  data-toggle="collapse"
                  data-target="#theme-select"
                  aria-expanded="true"
                  aria-controls="theme-select"
                >
                  Select background
                </button>
                <div
                  id="theme-select" 
                  className="collapse show"
                  aria-labelledby="theme-select-heading"
                  data-parent="#theme-accordion"
                >
                  <ThemeSelector selectedTheme={-1} updateBackgrounds={this.props.updateBackgrounds} />
                </div>
                <br />
                <button 
                  type="button"
                  id="theme-custom-heading"
                  className="btn btn-info m-1"
                  data-toggle="collapse"
                  data-target="#theme-custom"
                  aria-expanded="false"
                  aria-controls="theme-custom"
                >
                  Custom background
                </button>
                <div 
                  id="theme-custom"
                  className="collapse"
                  aria-labelledby="theme-custom-heading"
                  data-parent="#theme-accordion"
                >
                  <p>Day background</p>
                  <input
                    id="day-url"
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
                  <p>Night background</p>
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
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={this.handleSave}
                  >
                    Apply custom
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default BackgroundSettings;
