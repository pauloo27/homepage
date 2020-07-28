import React, { useState, useEffect } from "react";

export default function Weather() {
  const [weather, setWeather] = useState(undefined as string | undefined);
  useEffect(() => {
    const weatherCache = localStorage.getItem("weather-cache");
    const now = new Date().getTime() / 1000;
    
    if(weatherCache !== null) {
      console.log("Weather cache found...");
      const {date, data} = JSON.parse(weatherCache);
      if(now < date + (60 * 30)) {
        setWeather(data);
        return;
      }
      console.log("Weather cache is too old.")
    }

    console.log("Fetching weather...");
    fetch("https://wttr.in/?view=3")
      .then(res => res.text())
      .then(text => {
        localStorage.setItem("weather-cache", JSON.stringify({date: now, data: text}));
        setWeather(text);
      });
  }, [setWeather])
  
  return (<h6 id="weather">{weather || "Fetching weather"}</h6>);
}

