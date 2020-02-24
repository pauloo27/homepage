import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

export interface GCalendarSettingsProps {
  onLoginStatusChange: Function;
}

export interface GCalendarSettingsState {
  isSignedIn?: boolean;
  isClientReady: boolean;
  clientId: string;
  apiKey: string;
}

class GCalendarSettings extends Component<
  GCalendarSettingsProps,
  GCalendarSettingsState
> {
  state = {
    isSignedIn: undefined,
    clientId: "",
    apiKey: "",
    isClientReady: false
  };

  async componentDidMount() {
    const value = localStorage.getItem("gcalendar-config");
    if (value === null) {
      this.handleSave();
    } else {
      const obj = JSON.parse(value!);
      this.setState({ apiKey: obj.apiKey, clientId: obj.clientId });
    }

    const script = document.createElement("script");
    script.src = "https://apis.google.com/js/api.js";

    script.onload = () => {
      const gapi = (window as any).gapi;
      gapi.load("client:auth2", this.initClient);
    };

    document.body.appendChild(script);
  }

  handleClientIdChange = (e: React.ChangeEvent<HTMLElement>) => {
    this.setState({ clientId: (e.target as any).value });
  };

  handleApiKeyChange = (e: React.ChangeEvent<HTMLElement>) => {
    this.setState({ apiKey: (e.target as any).value });
  };

  initClient = () => {
    const gapi = (window as any).gapi;

    gapi.client
      .init({
        apiKey: this.state.apiKey,
        clientId: this.state.clientId,
        discoveryDocs: [
          "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"
        ],
        scope: "https://www.googleapis.com/auth/calendar.readonly"
      })
      .catch(() => {
        if (gapi.auth2.getAuthInstance() === null) {
          this.updateSigninStatus(false);
          return;
        }
      })
      .then(() => {
        if (gapi.auth2.getAuthInstance() === null) {
          this.updateSigninStatus(false);
          return;
        }

        this.setState({ isClientReady: true });

        gapi.auth2.getAuthInstance().isSignedIn.listen(this.updateSigninStatus);

        this.updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
      });
  };

  updateSigninStatus = (isSignedIn: boolean) => {
    this.setState({ isSignedIn });
    this.props.onLoginStatusChange(isSignedIn);
  };

  getActionButton = (gapi: any) => {
    if (!this.state.isClientReady) return null;
    if (this.state.isSignedIn) {
      return (
        <button
          onClick={() => gapi.auth2.getAuthInstance().signOut()}
          className="btn btn-secondary"
        >
          Sign out
        </button>
      );
    } else {
      return (
        <button
          onClick={() => gapi.auth2.getAuthInstance().signIn()}
          className="btn btn-primary"
        >
          Sign in with Google Account
        </button>
      );
    }
  };

  handleSave = () => {
    localStorage.setItem(
      "gcalendar-config",
      JSON.stringify({
        clientId: this.state.clientId,
        apiKey: this.state.apiKey
      })
    );
  };

  render() {
    if (this.state.isSignedIn === undefined) return null;

    const gapi = (window as any).gapi;

    return (
      <div
        className="modal fade"
        id="gcalendar-settings-modal"
        tabIndex={-1}
        role="dialog"
        aria-labelledby="gcalendar-settings-modal-label"
        aria-hidden="true"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="gcalendar-settings-modal-label">
                Google Calendar settings
              </h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">
                  <FontAwesomeIcon icon={faTimes} />
                </span>{" "}
              </button>
            </div>
            <div className="modal-body">
              <input
                defaultValue={this.state.clientId}
                placeholder="Client ID"
                onChange={this.handleClientIdChange}
              />
              <input
                defaultValue={this.state.apiKey}
                placeholder="API key"
                onChange={this.handleApiKeyChange}
              />
              {this.getActionButton(gapi)}
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-dismiss="modal"
                onClick={() => window.location.reload()}
              >
                Close
              </button>
              <button
                onClick={this.handleSave}
                type="button"
                className="btn btn-primary"
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

export default GCalendarSettings;
