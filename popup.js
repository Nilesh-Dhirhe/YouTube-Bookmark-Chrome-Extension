document.addEventListener('DOMContentLoaded', () => {
  // Function to display bookmarks
  function displayBookmarks() {
    chrome.storage.sync.get({ bookmarks: [] }, (data) => {
      const bookmarks = data.bookmarks;
      const bookmarksDiv = document.getElementById('bookmarks');
      bookmarksDiv.innerHTML = '';
      if (bookmarks.length === 0) {
        bookmarksDiv.innerHTML = '<p>No bookmarks yet.</p>';
      } else {
        bookmarks.forEach((bookmark, index) => {
          const bookmarkElement = createBookmarkElement(bookmark, index);
          bookmarksDiv.appendChild(bookmarkElement);
        });
      }
    });
  }

  // Function to create a bookmark element
  function createBookmarkElement(bookmark, index) {
    const bookmarkElement = document.createElement('div');
    bookmarkElement.className = 'bookmark';
    bookmarkElement.innerHTML = `
      <div>Title: ${bookmark.title}</div>
      <div>Time: ${new Date(bookmark.time * 1000).toISOString().substr(11, 8)}</div>
      <input type="text" placeholder="Bookmark Name" id="name${index}" value="${bookmark.name}">
      <textarea placeholder="Comments" id="comment${index}">${bookmark.comment}</textarea>
      <button id="rename${index}">Rename</button>
      <button id="goto${index}">Go To</button>
    `;
    
    // Event listener for renaming bookmark
    document.getElementById(`rename${index}`).addEventListener('click', () => {
      const newName = document.getElementById(`name${index}`).value;
      const newComment = document.getElementById(`comment${index}`).value;
      chrome.storage.sync.get({ bookmarks: [] }, (data) => {
        const bookmarks = data.bookmarks;
        bookmarks[index].name = newName;
        bookmarks[index].comment = newComment;
        chrome.storage.sync.set({ bookmarks }, () => {
          displayBookmarks();
        });
      });
    });

    // Event listener for going to bookmarked time
    document.getElementById(`goto${index}`).addEventListener('click', () => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, {
          action: "gotoTime",
          time: bookmark.time
        });
      });
    });

    return bookmarkElement;
  }

  // Display bookmarks initially
  displayBookmarks();

  // Event listener for taking a screenshot
  document.getElementById('takeScreenshot').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { action: "takeScreenshot" });
    });
  });

  // Event listener for bookmarking time
  document.getElementById('bookmarkTime').addEventListener('click', () => {
    const name = prompt('Enter a name for this bookmark (optional):');
    const comment = prompt('Enter any comments for this bookmark (optional):');
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { action: "bookmarkTime", name: name, comment: comment });
    });
  });
});
