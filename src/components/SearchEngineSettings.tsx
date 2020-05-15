import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import "../styles/SearchEngineSettings.scss";

interface SearchEngineSettingsProps {
  onSave: Function;
}

interface SearchEngineSettingsState {
  engineType: string;
  engineUrl?: string;
}

class SearchEngineSettings extends Component<
  SearchEngineSettingsProps,
  SearchEngineSettingsState
> {
  state = { engineType: "", engineUrl: "" };

  async componentDidMount() {
    const config = localStorage.getItem("search-engine");
    if (config === null) {
      await this.setState({ engineType: "duckduckgo" });
      this.saveEngine();
    } else {
      const json = JSON.parse(config);
      await this.setState({
        engineType: json.engineType,
        engineUrl: json.engineUrl,
      });
    }
    this.props.onSave(this.state);
  }

  saveEngine = () => {
    localStorage.setItem("search-engine", JSON.stringify(this.state));
  };

  handleChange = (e: React.ChangeEvent<HTMLElement>) => {
    this.setState({ engineType: (e.target as any).value! });
  };

  handleUrlChange = (e: React.ChangeEvent<HTMLElement>) => {
    this.setState({ engineUrl: (e.target as any).value! });
  };

  handleSave = async () => {
    if (
      !this.state.engineUrl.startsWith("https://") &&
      !this.state.engineUrl.startsWith("http://")
    ) {
      await this.setState((prevState) => ({
        engineUrl: `https://${prevState.engineUrl}`,
      }));
    }
    await this.saveEngine();
    this.props.onSave(this.state);
  };

  render() {
    if (this.state.engineType.length === 0) return null;
    return (
      <div
        className="modal fade"
        id="homepage-settings-modal"
        tabIndex={-1}
        role="dialog"
        aria-labelledby="homepage-settings-modal-label"
        aria-hidden="true"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="homepage-settings-modal-label">
                General settings
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
              <div>
                <o>Search engine</p>
                <select
                  id="search-engine"
                  onChange={this.handleChange}
                  defaultValue={this.state.engineType}
                >
                  <option value="duckduckgo">DuckDuckGO</option>
                  <option value="google">Google</option>
                  <option value="custom">Custom</option>
                </select>
                <input
                  placeholder="Insert custom search engine URL"
                  defaultValue={this.state.engineUrl}
                  onChange={this.handleUrlChange}
                  className={`${
                    this.state.engineType === "custom" ? "" : "hidden"
                  }`}
                />
              </div>
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

export default SearchEngineSettings;
