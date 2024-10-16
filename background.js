let isFocusModeOn = false;
let timerDuration = 25 * 60; // 25 minutes in seconds
let remainingTime = timerDuration; // Default to 25 minutes
let timerInterval;

const blockedSites = [
  "*://*.facebook.com/*",
  "*://*.twitter.com/*",
  "*://*.youtube.com/*",
  "*://*.instagram.com/*",
  "*://*.reddit.com/*",
];

// Load initial state from storage
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({
    isFocusModeOn: false,
    remainingTime: timerDuration,
  });
});

// Get initial state from storage
chrome.storage.sync.get(["isFocusModeOn", "remainingTime"], (data) => {
  isFocusModeOn = data.isFocusModeOn || false;
  remainingTime = data.remainingTime || timerDuration;
  updateBlockingStatus();
  updateBadge(remainingTime);
});

// Update badge and notify popup with the remaining time
function updateBadge(time) {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  const badgeText = `${minutes < 10 ? "0" + minutes : minutes}:${
    seconds < 10 ? "0" + seconds : seconds
  }`;

  chrome.action.setBadgeText({ text: badgeText });
}

// Notify the popup about the updated time
function notifyPopup(time) {
  chrome.runtime.sendMessage({ action: "updateTimer", remainingTime: time });
}

// Update blocking status based on Focus Mode
function updateBlockingStatus() {
  if (isFocusModeOn) {
    chrome.declarativeNetRequest.updateDynamicRules({
      addRules: [
        // Add your blocking rules here
      ],
      removeRuleIds: [1, 2, 3, 4, 5],
    });
    startTimer();
  } else {
    chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: [1, 2, 3, 4, 5],
    });
    clearInterval(timerInterval); // Clear timer
    updateBadge(0); // Clear badge display
  }
}

// Start the timer
function startTimer() {
  if (timerInterval) return; // Prevent multiple intervals

  timerInterval = setInterval(() => {
    remainingTime--;
    chrome.storage.sync.set({ remainingTime }); // Save remaining time

    updateBadge(remainingTime); // Update badge
    notifyPopup(remainingTime); // Notify popup

    if (remainingTime <= 0) {
      clearInterval(timerInterval);
      timerFinished();
    }
  }, 1000);
}

// When the timer finishes
function timerFinished() {
  chrome.notifications.create({
    type: "basic",
    iconUrl: "icons/icon48.png",
    title: "Focus Time Over!",
    message: "Your focus session is done. Time for a break!",
    priority: 2,
  });
  remainingTime = timerDuration; // Reset timer for next session
  updateBadge(remainingTime); // Reset badge display
  notifyPopup(remainingTime); // Notify popup
}

// Toggle Focus Mode
function toggleFocusMode() {
  isFocusModeOn = !isFocusModeOn;
  chrome.storage.sync.set({ isFocusModeOn });
  updateBlockingStatus();
}

// Listen for messages from popup to toggle Focus Mode
chrome.runtime.onMessage.addListener((message) => {
  if (message.action === "toggleFocusMode") {
    toggleFocusMode();
  }
});
