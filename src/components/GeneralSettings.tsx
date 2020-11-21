import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import "../styles/GeneralSettings.scss";

interface GeneralSettingsProps {
  onSave: Function;
}

interface GeneralSettingsState {
  engineType: string;
  engineUrl?: string;
  showToDo: boolean;
  showCalendar: boolean;
  showTrello: boolean;
  expandBookmarks: boolean;
}

class GeneralSettings extends Component<
  GeneralSettingsProps,
  GeneralSettingsState
> {
  state = { engineType: "", engineUrl: "", showToDo: true, showCalendar: true, showTrello: true, expandBookmarks: false};

  async componentDidMount() {
    const layoutConfig = localStorage.getItem("layout");
    if (layoutConfig !== null) {
      const { showToDo, showCalendar, showTrello, expandBookmarks} = JSON.parse(layoutConfig);
      this.setState({showToDo, showCalendar, showTrello, expandBookmarks});
    }

    const searchEngineConfig = localStorage.getItem("search-engine");
    if (searchEngineConfig === null) {
      this.setState({ engineType: "duckduckgo" }, () => {
        this.saveEngine();
        this.props.onSave(this.state);
      });
    } else {
      const json = JSON.parse(searchEngineConfig);
      this.setState({
        engineType: json.engineType,
        engineUrl: json.engineUrl,
      }, () => {
        this.props.onSave(this.state);
      });
    }
  }

  saveEngine = () => {
    localStorage.setItem("search-engine", JSON.stringify(this.state));
  };

  saveLayout = () => {
    localStorage.setItem("layout", JSON.stringify(
      {showToDo: this.state.showToDo, showCalendar: this.state.showCalendar, showTrello: this.state.showTrello, expandBookmarks: this.state.expandBookmarks}
    ));
  }

  handleChange = (e: React.ChangeEvent<HTMLElement>) => {
    this.setState({ engineType: (e.target as any).value! });
  };

  handleUrlChange = (e: React.ChangeEvent<HTMLElement>) => {
    this.setState({ engineUrl: (e.target as any).value! });
  };

  handleCheckboxChange = (e: React.ChangeEvent<any>, keyName: string) => {
    const newState = {} as any;
    newState[keyName] = e.target.checked;
    this.setState(newState);
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
    this.saveEngine();
    this.saveLayout();
    this.props.onSave(this.state);
  };

  render() {
    if (this.state.engineType.length === 0) return null;
    
    const cardsCount = [this.state.showToDo, this.state.showCalendar, this.state.showTrello]
      .filter(b => b)
      .length;

    return (
      <div
        className="modal fade"
        id="general-settings-modal"
        tabIndex={-1}
        role="dialog"
        aria-labelledby="general-settings-modal-label"
        aria-hidden="true"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="general-settings-modal-label">
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
                <span>Search engine</span>
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
              <hr />
              <div className="checkbox-input">
                <input defaultChecked={this.state.showToDo} type="checkbox" onChange={(e) => this.handleCheckboxChange(e, "showToDo")} />
                <span>Show To Do card</span>
              </div>
              <div className="checkbox-input">
                <input defaultChecked={this.state.showTrello} type="checkbox" onChange={(e) => this.handleCheckboxChange(e, "showTrello")} />
                <span>Show Trello card</span>
              </div>
              <div className="checkbox-input">
                <input defaultChecked={this.state.showCalendar} type="checkbox" onChange={(e) => this.handleCheckboxChange(e, "showCalendar")} />
                <span>Show Calendar card</span>
              </div>
              <div className="checkbox-input">
                <input defaultChecked={this.state.expandBookmarks} type="checkbox" onChange={(e) => this.handleCheckboxChange(e, "expandBookmarks")} disabled={cardsCount === 3} />
                <span>Expand bookmarks (requires 2 cards or less)</span>
              </div>
            </div>
            <div className="modal-footer">
              <button
                data-dismiss="modal"
                type="button"
                className="btn btn-primary"
                onClick={this.handleSave}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default GeneralSettings;
