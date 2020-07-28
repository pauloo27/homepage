import React, { useState, useEffect } from "react";

export default function Weather() {
  const [weather, setWeather] = useState(undefined as string | undefined);
  useEffect(() => {
    console.log("Fetching weather...");
    fetch("https://wttr.in/?view=3")
      .then(res => res.text())
      .then(text => setWeather(text));
  }, [setWeather])
  
  return (<h6 id="weather">{weather || "Fetching weather"}</h6>);
}

