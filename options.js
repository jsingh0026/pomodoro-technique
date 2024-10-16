document.addEventListener("DOMContentLoaded", () => {
  chrome.storage.sync.get("blockedSites", ({ blockedSites }) => {
    document.getElementById("blockedSites").value = blockedSites.join("\n");
  });
});

document.getElementById("save").addEventListener("click", () => {
  const blockedSites = document
    .getElementById("blockedSites")
    .value.split("\n");
  chrome.storage.sync.set({ blockedSites });
  alert("Blocked sites updated!");
});
