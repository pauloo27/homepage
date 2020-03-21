import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
const gapiconfig = { apiKey: "", clientId: "" };

export interface GCalendarSettingsProps {
  onLoginStatusChange: Function;
}

export interface GCalendarSettingsState {
  isSignedIn?: boolean;
  isClientReady: boolean;
}

class GCalendarSettings extends Component<
  GCalendarSettingsProps,
  GCalendarSettingsState
> {
  state = {
    isSignedIn: undefined,
    isClientReady: false
  };

  async componentDidMount() {
    try {
      const config = require("../config/gapi.json");
      if (config !== undefined) {
        gapiconfig.clientId = config.clientId;
        gapiconfig.apiKey = config.apiKey;
      }
    } catch (e) {
      console.log("Cannot find credentials file at src/config/gapi.json");
    }

    const script = document.createElement("script");
    script.src = "https://apis.google.com/js/api.js";

    script.onload = () => {
      const gapi = (window as any).gapi;
      gapi.load("client:auth2", this.initClient);
    };

    document.body.appendChild(script);
  }

  initClient = () => {
    const gapi = (window as any).gapi;

    gapi.client
      .init({
        apiKey: gapiconfig.apiKey,
        clientId: gapiconfig.clientId,
        discoveryDocs: [
          "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"
        ],
        scope: "https://www.googleapis.com/auth/calendar.readonly"
      })
      .catch(() => {
        console.log("Cannot init the Calendar client.");
        if (gapi.auth2.getAuthInstance() === null) {
          console.log("Calendar client's auth instance not found");
          this.updateSigninStatus(false);
          return;
        }
      })
      .then(() => {
        console.log("Calendar client loaded");
        if (gapi.auth2.getAuthInstance() === null) {
          console.log("Calendar client's auth instance not found");
          this.updateSigninStatus(false);
          return;
        }

        this.setState({ isClientReady: true });

        gapi.auth2.getAuthInstance().isSignedIn.listen(this.updateSigninStatus);

        this.updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
      });
  };

  updateSigninStatus = (isSignedIn: boolean) => {
    console.log("The login status was chagned to", isSignedIn);
    this.setState({ isSignedIn });
    this.props.onLoginStatusChange(isSignedIn);
  };

  getActionButton = (gapi: any) => {
    if (gapiconfig.clientId === "" || gapiconfig.apiKey === "")
      return "No credentials provided (see ./config/gapi.json)";
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
            <div className="modal-body">{this.getActionButton(gapi)}</div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-dismiss="modal"
                onClick={() => window.location.reload()}
              >
                Close
              </button>
              <button type="button" className="btn btn-primary">
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
