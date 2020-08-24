# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Option to enable/disable the weather in the calendar card.
- Option to enable/disable the main cards.
- Option to expand the bookmarks bar.
- Welcome modal displayed at the first time the homepage is used.

### Changed
- The gap between the cards from 10px to 4px.
- Modals close button color to red.
- Modals save button text to "Save" instead of "Save changes".

### Fixed
- The width of the cards to 1/3 of the page.
- The code references to "GeneralSettings" as "SearchEngineSettings".
- Bookmark bar with more than 15 entries.

### Removed
- Modals "Close" button.

## [2.2.0] - 2020-07-20

### Added
- Toggle background button.
- Background pre loader.
- Escape key handler in ToDo entry edit mode.
- Current weather to calendar container.
- Abstract data provider.
- Service worker so once loaded it can accessed without internet.

### Changed
- Background transition speed.
- ToDo entry edit mode icon from a pen to a floppy disk.

### Fixed
- Bookmark bar height when it's empty.

## [2.1.0] - 2020-04-10

### Added

- Trello checklists status to the card preview.
- ESLint.
- Day of week to the calendar events list.

### Changed

- Trello label background colors.
- Code format to fix some ESLint warnings.

## [2.0.1] - 2020-03-22

### Added

- Event end time to the Google Calendar event list.
- Auto remove of white spaces from the credentials when saved.
- Config file to store Google API Credentials.

### Changed

- The min-width to use the mobile view.

### Removed

- Per user Google API Credentials.

## [2.0.0] - 2020-03-09

### Added

- Trello loading animation.
- Auto focus to the search bar.
- Tooltip to the buttons.
- Trello integration status message (empty list and error).
- Trello labels to the card viewer.
- Google Calendar integration.
- Simple mobile view.
- Empty list message to the "To Do list".
- Edit mode to To Do Entry.
- Color "fade out" effect to "checked" To Do entries.

### Changed

- The bookmark from opening in a new tab to opening in the current tab.
- The loading animation.

### Removed

- Calendar from "react-calendar".

### Fixed

- Default background images compression.

## [1.0.0] - 2020-02-20

### Added

- Search bar.
- Bookmarks.
- TODO list.
- Simple calendar with Clock.
- Trello Integration.
- Day/Night background.
