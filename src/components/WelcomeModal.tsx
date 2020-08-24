import React, { useEffect, useState, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import $ from "jquery";
import "../styles/WelcomeModal.scss";

interface Theme {
  name: string;
  author: string;
  authorUrl: string;
  dayUrl: string;
  nightUrl: string;
}

const themes = [
  {
    name: "Pixelart city",
    author: "Unknown", 
    authorUrl: "https://imgur.com/a/WmmsFbs",
    dayUrl: "https://i.imgur.com/fxoldSH.jpg",
    nightUrl: "https://i.imgur.com/KccUkyq.jpg",
  },
  {
    name: "Forest",
    author: "sebastianinman",
    authorUrl: "https://dynamicwallpaper.club/u/sebastianinman",
    dayUrl: "https://i.imgur.com/CdaQWae.jpg",
    nightUrl: "https://i.imgur.com/eSK3Xdd.jpg",
  },
  {
    name: "Anime city",
    author: "dasalejo",
    authorUrl: "https://dynamicwallpaper.club/u/dasalejo",
    dayUrl: "https://i.imgur.com/CvRvFOB.jpg",
    nightUrl: "https://i.imgur.com/u8WqVCf.jpg",
  },
] as Array<Theme>;
interface ThemeOptionProps {
  theme: Theme;
  setId: Function;
  id: number;
  selected: number;
}

function ThemeOption(props: ThemeOptionProps) {
  return (
    <div
      className={`theme-option ${props.selected === props.id ? "theme-option-selected" : ""}`}
      onClick={() => props.setId(props.id)}
    >
      <img src={props.theme.dayUrl} alt={props.theme.name} />
    </div>
  );
}


interface WelcomeModalProps {
  updateBackgrounds: Function;
}

export default function WelcomeModal(props: WelcomeModalProps) {
  const [theme, setTheme] = useState(1);

  const handleThemeChange = useCallback((index: number) => {
    setTheme(index);
    const t = themes[index];
    localStorage.setItem("backgrounds", JSON.stringify({
      dayBackground: {
          url: t.dayUrl,
          author: t.author,
          authorUrl: t.authorUrl,
        },
        nightBackground: {
          url: t.nightUrl,
          author: t.author,
          authorUrl: t.authorUrl,
        },
    }));
    props.updateBackgrounds();
  }, [setTheme, props]);

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
              That's your first time using this homepage! Now this page is cached in your browser 
              so you can use it without internet (with limitations)!
            </p>
            <hr />
            <div id="theme-selector">
              <label>
                Select your favorite background theme:
              </label>
              <div id="theme-selector-options">
                <ThemeOption 
                  id={0}
                  selected={theme}
                  setId={handleThemeChange}
                  theme={themes[0]}
                />
                <ThemeOption 
                  id={1}
                  selected={theme}
                  setId={handleThemeChange}
                  theme={themes[1]}
                />
                <ThemeOption 
                  id={2}
                  selected={theme}
                  setId={handleThemeChange}
                  theme={themes[2]}
                />
              </div>
              <hr/>
              <p id="license-notice">
                This program is free software; you can redistribute it and/or modify it under the 
                terms of the GNU General Public License as published by the Free Software Foundation;
                either version 2 of the License, or (at your option) any later version.
              </p>
              <a href="https://github.com/Pauloo27/homepage/blob/master/LICENSE">Open LICENSE</a>
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
  )
}
