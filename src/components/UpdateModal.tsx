import React, {useEffect, useState} from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import $ from "jquery";
import "../styles/UpdateModal.scss";

interface UpdateModalProps {
  currentVersion: string;
  lastVersion: string;
}

export default function UpdateModal(props: UpdateModalProps) {
  const [changelog, setChangelog] = useState("Loading changelog...");

  useEffect(() => {
    ($("#update-modal") as any).modal("show");

    const githubUrl = `https://api.github.com/repos/Pauloo27/homepage/releases/tags/v${props.currentVersion}`;

    fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(githubUrl)}`)
      // eslint-disable-next-line
      .then(response => {
        if (response.ok) return response.json();
        setChangelog("Cannot load changelog.");
      })
      .then(data => { 
        setChangelog(JSON.parse(data.contents).body);
      });
  }, [setChangelog, props.currentVersion]);

  return (
    <div
      className="modal fade"
      id="update-modal"
      tabIndex={-1}
      role="dialog"
      aria-labelledby="update-modal-label"
      aria-hidden="true"
    >
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="update-modal-label">
              Welcome
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
            <h4>{`Version ${props.currentVersion} installed!`}</h4>
            <p>
              {`Homepage updated from version ${props.lastVersion} to ${props.currentVersion}.`}
            </p>
            <div id="changelog-container">
              <pre id="changelog">
                {changelog}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>

  );
}
