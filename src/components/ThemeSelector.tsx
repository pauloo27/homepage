import React, { useState, useCallback } from 'react';
import "../styles/ThemeSelector.scss";

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

interface ThemeSelectorProps {
  updateBackgrounds: Function;
  selectedTheme: number;
}

export default function ThemeSelector(props: ThemeSelectorProps) {
  const [theme, setTheme] = useState(props.selectedTheme);

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

  return (
    <div id="theme-selector">
      <span>
        Select your favorite background theme:
      </span>
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
    </div>
  )
}
