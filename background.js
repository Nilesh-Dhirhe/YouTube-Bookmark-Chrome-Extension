chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "bookmarkTime",
    title: "Bookmark this time",
    contexts: ["all"]
  });
  
  chrome.contextMenus.create({
    id: "takeScreenshot",
    title: "Take Screenshot",
    contexts: ["all"]
  });
});
  
chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "bookmarkTime") {
      chrome.tabs.sendMessage(tab.id, { action: "bookmarkTime" });
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: bookmarkTime
      });
    } else if (info.menuItemId === "takeScreenshot") {
        chrome.tabs.sendMessage(tab.id, { action: "takeScreenshot" });
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          function: takeScreenshot
      });
    }
});
  
// chrome.contextMenus.onClicked.addListener((info, tab) => {
//   if (info.menuItemId === "bookmarkTime") {
//     chrome.tabs.sendMessage(tab.id, { action: "bookmarkTime" });
//   } else if (info.menuItemId === "takeScreenshot") {
//     chrome.tabs.sendMessage(tab.id, { action: "takeScreenshot" });
//   }
// });
  

function bookmarkTime() {
  const currentTime = document.querySelector('.html5-main-video').currentTime;
  const videoTitle = document.querySelector('h1.title').innerText;
  chrome.storage.sync.get({ bookmarks: [] }, (data) => {
    const bookmarks = data.bookmarks;
    bookmarks.push({ title: videoTitle, time: currentTime });
    chrome.storage.sync.set({ bookmarks });
  });
}
  
function takeScreenshot() {
  const video = document.querySelector('.html5-main-video');
  const canvas = document.createElement('canvas');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  canvas.toDataURL('image/png').then((dataUrl) => {
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = 'screenshot.png';
    link.click();
  });
}
  