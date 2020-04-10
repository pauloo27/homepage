import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog } from '@fortawesome/free-solid-svg-icons';

interface BackgroundInfoProps {
  backgroundAuthor: string;
  backgroundAuthorUrl: string;
}

class BackgroundInfo extends Component<BackgroundInfoProps> {
  render() {
    return (
      <div id="background-info" className="footer-info">
        Image by
        {' '}
        <a
          href={this.props.backgroundAuthorUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          {this.props.backgroundAuthor}
        </a>
        <div data-toggle="tooltip" title="Open background settings">
          <div
            className="homepage-card-settings-holder"
            data-toggle="modal"
            data-target="#background-settings-modal"
          >
            <FontAwesomeIcon icon={faCog} className="homepage-card-settings" />
          </div>
        </div>
      </div>
    );
  }
}

export default BackgroundInfo;
