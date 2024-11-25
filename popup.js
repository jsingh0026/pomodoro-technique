const timerDisplay = document.getElementById("timerDisplay");
const startPauseButton = document.getElementById("startPauseButton");
const resetButton = document.getElementById("resetButton");

// Hide timer display until data is loaded
timerDisplay.style.visibility = "hidden";

// Fetch the latest timer state on load to avoid stale display
function fetchInitialTimerState() {
  chrome.storage.sync.get(["isRunning", "timeRemaining"], (data) => {
    const isRunning = data.isRunning || false;
    const timeRemaining = data.timeRemaining || 25 * 60; // Default to 25 minutes
    startPauseButton.textContent = isRunning ? "Pause" : "Start";
    updateTimerDisplay(timeRemaining);
  });
}

// Update the timer display
function updateTimerDisplay(time) {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  timerDisplay.textContent = `${minutes < 10 ? "0" : ""}${minutes}:${
    seconds < 10 ? "0" : ""
  }${seconds}`;
  timerDisplay.style.visibility = "visible"; // Show timer display once updated
}

// Toggle the start/pause state in the background
function toggleStartPause() {
  chrome.runtime.sendMessage({ action: "startPauseTimer" }, (response) => {
    const { isRunning, timeRemaining } = response;
    startPauseButton.textContent = isRunning ? "Pause" : "Start";
    updateTimerDisplay(timeRemaining);
  });
}

// Reset the timer in the background
function resetTimer() {
  chrome.runtime.sendMessage({ action: "resetTimer" }, (response) => {
    const { isRunning, timeRemaining } = response;
    startPauseButton.textContent = "Start";
    updateTimerDisplay(timeRemaining);
  });
}

// Set up event listeners
startPauseButton.addEventListener("click", toggleStartPause);
resetButton.addEventListener("click", resetTimer);

// Fetch timer state immediately upon loading
fetchInitialTimerState();

// Refresh the timer every second to stay in sync with the background
setInterval(() => {
  chrome.runtime.sendMessage({ action: "getTimerState" }, (response) => {
    const { isRunning, timeRemaining } = response;
    updateTimerDisplay(timeRemaining);
    startPauseButton.textContent = isRunning ? "Pause" : "Start";
  });
}, 1000);
