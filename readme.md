# Pomodoro Timer Chrome Extension

A simple and sleek Pomodoro timer built as a Chrome extension. This extension helps users stay focused and improve productivity by utilizing the Pomodoro technique, with a live timer displayed in the extension icon and a popup interface to start/pause and reset the timer.

## Features

- **Live Timer:** Real-time countdown visible in both the popup and the extension icon.
- **Start/Pause Button:** Toggle between starting and pausing the timer with a single button.
- **Reset Timer:** Reset the timer back to the initial 25 minutes.
- **Background Timer:** Timer continues running even when the popup is closed.
- **Minimal Design:** Clean and simple user interface designed for maximum usability and minimal distraction.

## Usage

- **Start/Pause:** Click the “Start Focus Timer” button to begin the countdown. Click the button again to pause the timer.
- **Reset:** Click the “Reset Timer” button to reset the timer back to the default 25 minutes.

## Permissions

- **Storage:** The extension uses `chrome.storage.sync` to store the state of the timer and focus mode across sessions.
- **Notifications:** (Optional) Notifications can be enabled for Pomodoro completion (if added in future versions).
- **Host Permissions:** Not required for this extension as it does not interact with any external servers or APIs.

## Installation

### Prerequisites

- Google Chrome installed on your machine.

### Steps to Install

1. **Download the Repository**:
   ```bash
   git clone https://github.com/jsingh0026/pomodoro-technique
   ```
