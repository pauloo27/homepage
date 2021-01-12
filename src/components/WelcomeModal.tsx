import React, { useEffect, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import $ from "jquery";
import ThemeSelector from "./ThemeSelector";

interface WelcomeModalProps {
  updateBackgrounds: Function;
}

export default function WelcomeModal(props: WelcomeModalProps) {
  const handleSave = useCallback(() => {
    ($("#welcome-modal") as any).modal("hide");
    ($("#general-settings-modal") as any).modal("show");
  }, []);

  useEffect(() => {
    ($("#welcome-modal") as any).modal("show");
  }, []);

  return (
    <div
      className="modal fade"
      id="welcome-modal"
      tabIndex={-1}
      role="dialog"
      aria-labelledby="welcome-modal-label"
      aria-hidden="true"
    >
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="welcome-modal-label">
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
            <h4>Hello!</h4>
            <p>
              It&rsquo;s your first time using this homepage! Now this page is
              cached in your browser so you can use it without internet (with
              limitations)!
            </p>
            <hr />
            <ThemeSelector
              selectedTheme={1}
              updateBackgrounds={props.updateBackgrounds}
            />
            <hr />
            <div id="licese-notice">
              <p>
                This program is free software; you can redistribute it and/or
                modify it under the terms of the GNU General Public License.
              </p>
              <p>
                This program is distributed in the hope that it will be useful,
                but WITHOUT ANY WARRANTY; without even the implied warranty of
                MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
              </p>
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://github.com/Pauloo27/homepage/blob/master/LICENSE"
              >
                See the license for more details
              </a>
            </div>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSave}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
