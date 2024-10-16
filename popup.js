let isFocusModeOn = false;
let remainingTime;

// Load saved timer and Focus Mode state from storage on popup load
document.addEventListener("DOMContentLoaded", () => {
  chrome.storage.sync.get(["isFocusModeOn", "remainingTime"], (data) => {
    isFocusModeOn = data.isFocusModeOn || false;
    remainingTime = data.remainingTime || 1500; // Default to 25 minutes

    updateFocusModeUI(isFocusModeOn);
    updateTimerDisplay(remainingTime);
  });

  // Listen for messages from the background script
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "updateTimer") {
      remainingTime = message.remainingTime;
      updateTimerDisplay(remainingTime);
    }
  });
});

document.getElementById("toggleFocus").addEventListener("click", () => {
  toggleFocusMode();
});

document.getElementById("startTimer").addEventListener("click", () => {
  chrome.runtime.sendMessage({ action: "startTimer" }); // Start timer in background
});

// Function to toggle Focus Mode
function toggleFocusMode() {
  isFocusModeOn = !isFocusModeOn;
  chrome.storage.sync.set({ isFocusModeOn });
  updateFocusModeUI(isFocusModeOn);
  chrome.runtime.sendMessage({ action: "toggleFocusMode" }); // Notify background script
}

// Update the timer display in the popup
function updateTimerDisplay(time) {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  document.getElementById("timerDisplay").textContent = `${
    minutes < 10 ? "0" + minutes : minutes
  }:${seconds < 10 ? "0" + seconds : seconds}`;
}

// Update Focus Mode UI
function updateFocusModeUI(isFocusModeOn) {
  const toggleButton = document.getElementById("toggleFocus");
  const statusDisplay = document.getElementById("focusStatus");

  if (isFocusModeOn) {
    toggleButton.classList.remove("focus-off");
    toggleButton.classList.add("focus-on");
    toggleButton.textContent = "Focus Mode: On";
    statusDisplay.textContent = "Focus Mode is currently on";
  } else {
    toggleButton.classList.remove("focus-on");
    toggleButton.classList.add("focus-off");
    toggleButton.textContent = "Focus Mode: Off";
    statusDisplay.textContent = "Focus Mode is currently off";
  }
}
