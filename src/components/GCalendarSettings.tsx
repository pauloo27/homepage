import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

export interface GCalendarSettingsProps {
  onLoginStatusChange: Function;
  showWeather: boolean;
  onSave: Function;
}

export interface GCalendarSettingsState {
  isSignedIn?: boolean;
  isClientReady: boolean;
  showWeather: boolean;
  clientId: string;
  clientSecret: string;
}

class GCalendarSettings extends Component<
  GCalendarSettingsProps,
  GCalendarSettingsState
> {
  state = {
    isSignedIn: undefined,
    isClientReady: false,
    clientId: "",
    clientSecret: "",
    showWeather: true,
  };

  async componentDidMount() {
    this.setState({ showWeather: this.props.showWeather });

    const rawConfig = localStorage.getItem("gcalendar-config");
    if (rawConfig === null) {
      this.handleSave();
    } else {
      const {clientId, clientSecret} = JSON.parse(rawConfig!);
      this.setState({clientId, clientSecret});
    }

    this.initClient();
  }

  initClient = () => {
    const { gapi } = window as any;

    const gcalendarToken = localStorage.getItem("gcalendar-token");
    if (gcalendarToken === null) {
      console.log("No credentials found...");
      this.updateSigninStatus(false);
    } else {
      console.log("Token found");
      gapi.load("client", async () => {
        gapi.client.init({
          clientId: this.state.clientId,
          discoveryDocs: [
            "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"
          ],
          scope: "https://www.googleapis.com/auth/calendar.readonly"
        });

        const token = JSON.parse(gcalendarToken);
        gapi.client.setToken(token);
        setTimeout(() => {
          this.updateSigninStatus(true);
          console.log("GAPI client is ready");
        }, 6500);
      });
    }
  };

  updateSigninStatus = (isSignedIn: boolean) => {
    console.log("The login status was chagned to", isSignedIn);
    this.setState({ isSignedIn });
    this.props.onLoginStatusChange(isSignedIn);
  };

  getActionButton = (gapi: any) => {
    if (this.state.clientId === undefined)
      return "This extension is not ready to be used... read the docs.";
    if (!this.state.isClientReady) return null;
    if (this.state.isSignedIn) {
      return (
        <button
          type="button"
          onClick={() => gapi.auth2.getAuthInstance().signOut()}
          className="btn btn-secondary"
        >
          Sign out
        </button>
      );
    }
    return (
      <button
        type="button"
        onClick={() => gapi.auth2.getAuthInstance().signIn()}
        className="btn btn-primary"
      >
        Sign in with Google Account
      </button>
    );
  };

  handleSave = () => {
    localStorage.setItem(
      "show-weather",
      JSON.stringify({ showWeather: this.state.showWeather })
    );
    this.props.onSave({ showWeather: this.state.showWeather });
  };

  handleShowWeather = (e: React.ChangeEvent<any>) => {
    this.setState({ showWeather: e.target.checked });
  };

  render() {
    if (this.state.isSignedIn === undefined) return null;

    const { gapi } = window as any;

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
              {this.getActionButton(gapi)}
              <hr />
              <div className="checkbox-input">
                <input
                  type="checkbox"
                  defaultChecked={this.props.showWeather}
                  onChange={this.handleShowWeather}
                />
                <span>Show weather</span>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-primary"
                onClick={this.handleSave}
                data-dismiss="modal"
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

export default GCalendarSettings;
