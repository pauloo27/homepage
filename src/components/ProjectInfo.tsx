import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog } from "@fortawesome/free-solid-svg-icons";

interface ProjectInfoProps {
  version: string;
}

class ProjectInfo extends Component<ProjectInfoProps, any>  {
  render() {
    return (
      <div className="footer-info">
        <div data-toggle="tooltip" title="Open general settings">
          <div
            className="homepage-card-settings-holder"
            data-toggle="modal"
            data-target="#general-settings-modal"
          >
            <FontAwesomeIcon icon={faCog} className="homepage-card-settings" />
          </div>
        </div>
        <a
          href="https://github.com/Pauloo27/homepage"
          target="_blank"
          rel="noopener noreferrer"
        >
          Homepage v{this.props.version}
        </a>{" "}
        under 
        <a
          href="https://github.com/Pauloo27/homepage/blob/master/LICENSE"
          target="_blank"
          rel="noopener noreferrer"
        >
          GPL-2 license
        </a>
      </div>
    );
  }
}

export default ProjectInfo;
