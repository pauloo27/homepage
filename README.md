# Homepage

![GitHub release (latest SemVer)](https://img.shields.io/github/v/release/Pauloo27/homepage?style=for-the-badge)
![GitHub Release Date](https://img.shields.io/github/release-date/pauloo27/homepage?style=for-the-badge)
[![Build Status](https://img.shields.io/endpoint.svg?url=https%3A%2F%2Factions-badge.atrox.dev%2FPauloo27%2Fhomepage%2Fbadge%3Fref%3Dmaster&style=for-the-badge)](https://actions-badge.atrox.dev/Pauloo27/homepage/goto?ref=master)
[![GitHub license](https://img.shields.io/github/license/Pauloo27/homepage?style=for-the-badge)](https://github.com/Pauloo27/homepage/blob/master/LICENSE)

![Screenshot](https://i.imgur.com/EzHH6o8.png)

## Features

- Search bar.
- Bookmarks.
- To Do list.
- Google Calendar Integration.
- Weather.
- Trello Integration.
- Day and Night wallpaper.

## How to use

You can run it locally or use [the one hosted at GitHub Pages](https://pauloo27.github.io/homepage).

### Recommended wallpapers

By default homepage has 2 wallpapers, the `day wallpaper` that is used from 6 am until 6 pm and a 
`night wallpaper` that used from 6 pm until 6 am. You can customize and set your own background to it.
You can find dynamic wallpapers at https://dynamicwallpaper.club.

Here are some good looking ones:

- [Pixelart City](https://imgur.com/a/WmmsFbs) 
- [Anime City](https://imgur.com/a/Fe6qEcm) 
- [Forest](https://imgur.com/a/UharzB1) 

## How to run it locally

First, make sure you have NodeJS and Yarn installed, then clone the repository.

To install all the dependencies, in the repository folder run:

> yarn install

After that, start the application with hot reload with:

> yarn start

To get a better performance, create a production build with

> yarn build

(the folder `build/` will be created, just add it to a web server).

### Configure Google Calendar Integration

To use the Google Calendar integration locally you need to configure the credentials.

To do so, create a new project and enable the Calendar API in the [Google Developers Console](https://console.developers.google.com/)
and get an API KEY and the CLIENT ID ([like this](https://developers.google.com/calendar/quickstart/js)).

With the CLIENT ID and the API KEY, create a file `src/config/gapi.json` with the following content:

```json
{"apiKey": "YOUR API KEY", "clientId": "YOUR CLIENT ID"}
```

## CHANGELOG

See the [CHANGELOG file](./CHANGELOG.md)

## License

<img src="https://i.imgur.com/AuQQfiB.png" alt="GPL Logo" height="100px" />

This project is licensed under [GNU General Public License v2.0](./LICENSE).

This program is free software; you can redistribute it and/or modify 
it under the terms of the GNU General Public License as published by 
the Free Software Foundation; either version 2 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU General Public License for more details.
