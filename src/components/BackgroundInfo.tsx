import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog, faAdjust } from '@fortawesome/free-solid-svg-icons';

interface BackgroundInfoProps {
  backgroundAuthor: string;
  backgroundAuthorUrl: string;
  toggleBackground: Function;
}

class BackgroundInfo extends Component<BackgroundInfoProps> {
  render() {
    return (
      <div id="background-info" className="footer-info">
        <div
          data-toggle="tooltip"
          title="Toggle background"
          onClick={() => this.props.toggleBackground()}
          className="homepage-toggle-background"
        >
          <div>
            <FontAwesomeIcon icon={faAdjust} />
          </div>
        </div>
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
