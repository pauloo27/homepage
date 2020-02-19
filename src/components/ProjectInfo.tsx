import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog } from "@fortawesome/free-solid-svg-icons";

class ProjectInfo extends Component {
  render() {
    return (
      <div className="footer-info">
        <div
          className="homepage-card-settings-holder"
          data-toggle="modal"
          data-target="#homepage-settings-modal"
        >
          <FontAwesomeIcon icon={faCog} className="homepage-card-settings" />
        </div>
        Homepage made by{" "}
        <a
          href="https://github.com/Pauloo27/homepage"
          target="_blank"
          rel="noopener noreferrer"
        >
          Pauloo27
        </a>{" "}
        under GPL-2 license
      </div>
    );
  }
}

export default ProjectInfo;
