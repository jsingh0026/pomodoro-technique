const timerDisplay = document.getElementById("timerDisplay");
const startPauseButton = document.getElementById("startPauseButton");
const resetButton = document.getElementById("resetButton");

let isRunning = false;

// Hide timer display until data is loaded
timerDisplay.style.visibility = "hidden";

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
    isRunning = response.isRunning;
    startPauseButton.textContent = isRunning ? "Pause" : "Start";
    updateTimerDisplay(response.timeRemaining);
  });
}

// Reset the timer in the background
function resetTimer() {
  chrome.runtime.sendMessage({ action: "resetTimer" }, (response) => {
    isRunning = response.isRunning;
    startPauseButton.textContent = "Start";
    updateTimerDisplay(response.timeRemaining);
  });
}

// Fetch the latest timer state on load to avoid stale display
function fetchInitialTimerState() {
  chrome.runtime.sendMessage({ action: "getTimerState" }, (response) => {
    isRunning = response.isRunning;
    startPauseButton.textContent = isRunning ? "Pause" : "Start";
    updateTimerDisplay(response.timeRemaining);
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
    isRunning = response.isRunning;
    updateTimerDisplay(response.timeRemaining);
    startPauseButton.textContent = isRunning ? "Pause" : "Start";
  });
}, 1000);
