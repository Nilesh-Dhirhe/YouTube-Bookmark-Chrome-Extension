// This content script runs in the context of the YouTube page

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "bookmarkTime") {
    bookmarkTime(request.name, request.comment);
  } else if (request.action === "takeScreenshot") {
    takeScreenshot();
  } else if (request.action === "gotoTime") {
    gotoTime(request.time);
  }
});

// Function to bookmark the current time of the video
function bookmarkTime(name, comment) {
  const video = document.querySelector('.html5-main-video');
  if (video) {
    const currentTime = video.currentTime;
    const videoTitle = document.title;

    chrome.storage.sync.get({ bookmarks: [] }, (data) => {
      const bookmarks = data.bookmarks;
      bookmarks.push({ title: videoTitle, time: currentTime, name: name, comment: comment });
      chrome.storage.sync.set({ bookmarks }, () => {
        alert(`Bookmarked ${videoTitle} at ${new Date(currentTime * 1000).toISOString().substr(11, 8)}`);
      });
    });
  }
}

// Function to take a screenshot of the current video frame
function takeScreenshot() {
  const video = document.querySelector('.html5-main-video');
  if (video) {
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/png');
    chrome.storage.sync.set({ screenshotUrl: dataUrl }, () => {
      console.log('Screenshot taken and saved to storage.');
    });
  }
}

// Function to go to a specific time and play the video
function gotoTime(time) {
  const video = document.querySelector('.html5-main-video');
  if (video) {
    video.currentTime = time;
    video.play();
  }
}
