let timer;
let isRunning = false;
let timeRemaining = 25 * 60; // Default to 25 minutes

// Update badge text on the icon with the remaining time
function updateBadgeText() {
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  const text = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  chrome.action.setBadgeText({ text });
}

// Start the timer
function startTimer() {
  if (!isRunning) {
    isRunning = true;
    timer = setInterval(() => {
      if (timeRemaining > 0) {
        timeRemaining--;
        updateBadgeText();
      } else {
        clearInterval(timer);
        isRunning = false;
        alert("Time's up! Take a break!");
        resetTimer();
      }
    }, 1000);
  }
}

// Pause the timer
function pauseTimer() {
  clearInterval(timer);
  isRunning = false;
}

// Reset the timer
function resetTimer() {
  clearInterval(timer);
  isRunning = false;
  timeRemaining = 25 * 60; // Reset to 25 minutes
  updateBadgeText();
}

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "startPauseTimer") {
    isRunning ? pauseTimer() : startTimer();
  } else if (message.action === "resetTimer") {
    resetTimer();
  } else if (message.action === "getTimerState") {
    sendResponse({ isRunning, timeRemaining });
  }
  sendResponse({ isRunning, timeRemaining });
});

// Initialize badge text on load
updateBadgeText();
