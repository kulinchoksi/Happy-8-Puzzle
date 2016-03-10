chrome.app.runtime.onLaunched.addListener(function() {
  chrome.app.window.create('index.html', {
    "id": "cziHappy8Puzzle",
    "width": 400,
    "maxHeight": 629,
    "frame": "none",
    "resizable": false
  });
});